import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import superagent from 'superagent';
import { toast } from 'react-toastify';

class UploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableUpload: false
    };
  } // constructor

  get onFingerprint() { return this.props.onFingerprint; }

  async handleFileDrop(file) {
    this.onFingerprint(null, null);
    this.disableUpload();

    const toastId = toast(`Sending '${file.name}' to Angel's Wings for fingerprinting ...`, { autoClose: 12000 });

    try {
      const response = await superagent
        .post('fingerprint')
        .field('lastModified', file.lastModified)
        .attach('candidate', file)

      toast.update(toastId, { render: `${file.name} characterized`, autoClose: 5000 });
      this.onFingerprint(file.name, response.body);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(`Could not fingerprint ${file.name} : ${err.message}`);
    }

    this.enableUpload();
  } // handleFileDrop

  disableUpload() { this.setState({'disableUpload': true}); }
  enableUpload() { this.setState({'disableUpload': false}); }

  render() {
    return (
      <div className="container-fluid">
        <div className={"row " + (this.props.readonly ? 'd-none' : '')}>
          <Dropzone onDrop={files => this.handleFileDrop(files[0])}
                    disabled={this.state.disableUpload}
                    disabledClassName="disabled"
                    multiple={false}
                    className="form-control btn btn-secondary col-md-2">
            Add Image
          </Dropzone>
        </div>
      </div>
    )
  } // render
} // class UploadBox

export default UploadBox;
