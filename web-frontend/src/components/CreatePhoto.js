import React, { Fragment } from 'react';
import UploadBox from './upload/UploadBox';
import { PhotoPackage } from '../lib';
import CreatePackage from './upload/CreatePackage';

class CreatePhoto extends CreatePackage {
  constructor(props) {
    super(props, [], null);
  } // constructor

  get type() { return 'Fingerprint'; }

  preparePayload(timestamp, data, fingerprint) {
    const payload = {
      data,
      fingerprint: fingerprint.fingerprint,
      filename: fingerprint.filename,
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
              <strong>Photo</strong> - { this.packageInfo && this.packageInfo.key }
            </div>
          </div>
        </div>
        <p/>
        <PhotoPackage key={`photo-${this.count}`}
                 onData={data => this.onData(data)}
                 readonly={this.isConfirming}
                 ref={packageInfo => this.packageInfo = packageInfo}
        />
        {
          this.packageInfo && this.packageInfo.fingerprint && <p>Image Loaded</p>
        }

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
