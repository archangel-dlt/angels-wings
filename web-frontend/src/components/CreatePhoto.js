import React, { Fragment } from 'react';
import UploadBox from './upload/UploadBox';
import { SipInfo } from '../lib';
import CreatePackage from './upload/CreatePackage';

class CreatePhoto extends CreatePackage {
  constructor(props) {
    super(props, [], null);
  } // constructor

  get type() { return 'PHOTO'; }

  preparePayload(timestamp, data, files) {
    const payload = {
      data,
      files,
      timestamp
    };

    return payload;
  } // preparePayload

  renderForm() {
    return (
      <Fragment>
        <div className={`container-fluid`}>
          <div className='row'>
            <div className='col form-control'>
              <strong>Photo</strong> - { this.sipInfo && this.sipInfo.key }
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
                   readonly={this.isConfirming}
                   ref={upload => this.uploadBox = upload}
        />
      </Fragment>
    )
  }
} // class CreateSIP

export default CreatePhoto;
