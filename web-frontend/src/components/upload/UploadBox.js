import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import superagent from 'superagent';
import { toast } from 'react-toastify';

class UploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableUpload: false,
      payload: [ ]
    };
  } // constructor

  get onFiles() { return this.props.onFiles; }
  get files() { return this.state.payload; }

  setFiles(files) {
    this.setState({
      payload: files,
      external: true
    })
  }

  async handleFileDrop(file) {
    this.onFiles(null);
    this.disableUpload();

    const toastId = toast(`Sending '${file.name}' to Angel's Wings for fingerprinting ...`, { autoClose: 12000 });

    try {
      const response = await superagent
        .post('fingerprint')
        .field('lastModified', file.lastModified)
        .attach('candidate', file)

      toast.update(toastId, { render: `${file.name} characterized`, autoClose: 5000 });
      this.fileCharacterised(file.name, response.body);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(`Could not fingerprint ${file.name} : ${err.message}`);
    }

    this.onFiles(this.state.payload);
    this.enableUpload();
  } // handleFileDrop

  disableUpload() { this.setState({'disableUpload': true}); }
  enableUpload() { this.setState({'disableUpload': false}); }

  fileCharacterised(name,imageHash) {
    const payload = {
      fingerprint: imageHash,
      filename: name
    };
    this.setState({
      'payload': payload
    })
  } // fileCharacterised

  render() {
    return (
      <div className="container-fluid">
        <div className={"row " + ((this.props.readonly || this.state.external) ? 'd-none' : '')}>
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
