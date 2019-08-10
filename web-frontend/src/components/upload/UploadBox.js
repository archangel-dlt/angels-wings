import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import superagent from 'superagent';
import { FileList } from '../../lib';
import { toast } from 'react-toastify';

class UploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      includeFilenames: true,
      disableUpload: false,
      payload: [ ]
    };
  } // constructor

  get onIncludeFilenames() { return this.props.onIncludeFilenames }
  get onFiles() { return this.props.onFiles; }
  get files() { return this.state.payload; }

  setFiles(files) {
    this.setState({
      payload: files,
      external: true
    })
  }

  async handleFileDrop(files) {
    this.onFiles(null);
    this.disableUpload();

    let c = 0;
    for(const file of files) {
      const prefix = `File ${++c} of ${files.length}: `;
      const toastId = toast(`${prefix}Sending '${file.name}' to DROID for characterization ...`, { autoClose: 12000 });

      try {
        const response = await superagent
          .post('upload')
          .field('lastModified', file.lastModified)
          .attach('candidate', file)

        toast.update(toastId, { render: `${prefix}${file.name} characterized`, autoClose: 5000 });
        this.fileCharacterised(response.body);
      } catch (err) {
        toast.dismiss(toastId);
        toast.error(`${prefix}Could not characterize ${file.name} : ${err.message}`);
      }
    } // for ...

    this.onFiles(this.state.payload);
    this.onIncludeFilenames(this.state.includeFilenames)
    this.enableUpload();
  } // handleFileDrop

  disableUpload() { this.setState({'disableUpload': true}); }
  enableUpload() { this.setState({'disableUpload': false}); }

  fileCharacterised(droidInfo) {
    const json = droidInfo.map(info => {
      const j = {
        path: info.PATH,
        name: info.NAME,
        puid: info.PUID,
        sha256_hash: info.SHA256_HASH,
        size: info.SIZE,
        type: info.TYPE,
        uuid: info.UUID
      };

      if (info.LAST_MODIFIED)
        j.last_modified = info.LAST_MODIFIED;
      if (info.PARENT_ID)
        j.parent_sha256_hash = info.PARENT_SHA256_HASH;

      return j;
    })

    const payload = this.state.payload;
    payload.push(...json);
    this.setState({
      'payload': payload
    })
  } // fileCharacterised

  toggleIncludeFilenames(enabled) {
    this.setState({
      'includeFilenames': enabled
    })
  } // toggleIncludeFilenames

  render() {
    return (
      <div className="container-fluid">
        <div className={"row " + ((this.props.readonly || this.state.external) ? 'd-none' : '')}>
          <Dropzone onDrop={files => this.handleFileDrop(files)}
                    disabled={this.state.disableUpload}
                    disabledClassName="disabled"
                    className="form-control btn btn-secondary col-md-2">
            Add Files
          </Dropzone>
        </div>
        <div className="offset-md-10 col-md-2">
          <input name="includeFilenames"
                 type="checkbox"
                 enabled={(!this.props.readonly).toString()}
                 checked={this.state.includeFilenames}
                 onChange={evt => this.toggleIncludeFilenames(evt.checked)}/>
          <label>&nbsp;&nbsp;Include filenames</label>
        </div>
        <div className="row">
          <FileList files={this.state.payload} showPath={!this.props.readonly || this.state.includeFilenames} showUuid={true}/>
        </div>
      </div>
    )
  } // render
} // class UploadBox

export default UploadBox;
