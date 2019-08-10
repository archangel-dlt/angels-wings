import React, { Fragment } from 'react';
import Dropzone from 'react-dropzone';
import UploadBox from './upload/UploadBox';
import { SipInfo } from '../lib';
import CreatePackage from './upload/CreatePackage';
import { toast } from "react-toastify";
import superagent from "superagent";

class CreateSIP extends CreatePackage {
  constructor(props) {
    super(props, [], null);
  } // constructor

  get type() { return 'SIP'; }

  onIncludeFilenames(includeFilenames) {
    this.setState({
      includeFilenames: includeFilenames
    })
  } // onIncludeFilenames

  preparePayload(timestamp, data, files) {
    const strippedFiles = files.map(file => {
      return {
        path: file.path,
        name: file.name,
        type: file.type,
        puid: file.puid,
        sha256_hash: file.sha256_hash,
        size: file.size,
        last_modified: file.last_modified,
        uuid: file.uuid
      }
    });

    if (!this.state.includeFilenames) {
      strippedFiles.forEach(file => {
        delete file.path
        delete file.name
      })
    }

    const payload = {
      data,
      files: strippedFiles,
      timestamp
    };

    return payload;
  } // preparePayload

  onFiles(files) {
    super.onFiles(files)
    this.hideImport()
  }

  async importPreservicaSIP(sipFile) {
    this.disableImport();

    const toastId = toast(`Importing '${sipFile.name}' ...`, { autoClose: 12000 });

    try {
      const response = await superagent
        .post('import-preservica')
        .field('lastModified', sipFile.lastModified)
        .attach('sip', sipFile)

      const { data, files } = response.body
      this.sipInfo.setData(data)
      this.uploadBox.setFiles(files)
      toast.update(toastId, { render: `${sipFile.name} imported`, autoClose: 5000 });
      this.hideImport();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(`Could not import ${sipFile.name} : ${err.message}`);
      this.enableImport();
    }
  }

  disableImport() { this.setState({'disableImport': true}); }
  enableImport() { this.setState({'disableImport': false}); }
  hideImport() { this.setState({'hideImport': true}); }

  get canImport() { return !this.state.hideImport }

  renderForm() {
    const showImport = this.canImport && this.isCreating
    return (
      <Fragment>
        <div className={`container-fluid`} hidden={showImport}>
          <div className='row'>
            <div className='col form-control'>
              <strong>SIP</strong> - { this.sipInfo && this.sipInfo.key }
            </div>
          </div>
        </div>
        <p/>
        <SipInfo key={`sip-${this.count}`}
                 onData={data => this.onData(data)}
                 readonly={this.isConfirming}
                 ref={sipInfo => this.sipInfo = sipInfo}
        />
        <hr/>
        <UploadBox key={`files-${this.count}`}
                   onFiles={files => this.onFiles(files)}
                   onIncludeFilenames={includeFilenames => this.onIncludeFilenames(includeFilenames)}
                   readonly={this.isConfirming}
                   ref={upload => this.uploadBox = upload}
        />
        <ImportBtn visible={showImport}
                   disabled={this.state.disableImport}
                   onClick={file => this.importPreservicaSIP(file)}/>
      </Fragment>
    )
  }
} // class CreateSIP

function ImportBtn({visible, disabled, onClick}) {
  if (!visible)
    return null;
  return (
    <Dropzone onDrop={files => onClick(files[0])}
              disabled={disabled}
              disabledClassName="disabled"
              className="form-control btn btn-outline-info col-md-2">
      Import Preservica SIP
    </Dropzone>
  );
} // CreateBtn

export default CreateSIP;
