import React, { Fragment, Component } from 'react';
import UploadBox from './upload/UploadBox';
import PhotoPackage from './ui/PhotoPackage';
import { DateTime } from "luxon";
import { toast } from 'react-toastify';

class CreatePhoto extends Component {
  constructor(props, fingerprint = [], data = null) {
    super(props);

    this.state = {
      step: 'creating',
      fingerprint: fingerprint,
      data: data,
      count: 0
    }
  } // constructor

  get type() { return 'Fingerprint'; }

  reset() {
    this.setState({ count: this.count + 1 });
    this.updateCanCreate(null, null);
  } // reset
  get count() { return this.state.count; }

  onData(data) { this.updateCanCreate(data, this.state.fingerprint); }
  onFingerprint(filename, fingerprint) {
    this.packageInfo.update('filename', filename);
    this.updateCanCreate(this.state.data, fingerprint);
  }
  updateCanCreate(data, fingerprint) {
    const ready = (data !== null && fingerprint !== null)
    this.setState({
      data,
      fingerprint,
      step: ready ? 'canCreate' : 'creating'
    });
  } // updateCanCreate

  onCreate() { this.setState({ step: 'canConfirm' }); }
  onBack() { this.setState({ step: 'canCreate' }); }
  onConfirm() {
    this.setState({ step: 'uploading' });
    this.upload();
  } // onConfirm

  upload() {
    const timestamp = DateTime.utc().toFormat('yyyy-MM-dd\'T\'HH:mm:ssZZ');
    const { data, fingerprint } = this.state;

    const payload = {
      data,
      fingerprint,
      timestamp
    };

    this.props.driver.store(data.key, payload)
      .transaction(() => { toast(`${this.type} submitted`); this.reset(); })
      .then(() => toast.success(`${this.type} written to blockchain`))
      .catch(err => {
        toast.error(`${err}`);
        if (this.isConfirming)
          this.setState({ step: 'canConfirm' });
      });
  } // upload

  get isCreating() { return (this.state.step === 'canCreate') || (this.state.step === 'creating') }
  get canCreate() { return this.state.step === 'canCreate'; }
  get isConfirming() { return (this.state.step === 'canConfirm') || (this.state.step === 'uploading') }
  get canConfirm() { return this.state.step === 'canConfirm'; }

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
        <hr/>
        <UploadBox key={`files-${this.count}`}
                   onFingerprint={(filename, fingerprint) => this.onFingerprint(filename, fingerprint)}
                   readonly={this.isConfirming}
                   ref={upload => this.uploadBox = upload}
        />
      </Fragment>
    )
  }

  render() {
    return (
      <Fragment>
        <div className='container-fluid'>
          <CreateBtn
            disabled={!this.canCreate}
            visible={this.isCreating}
            onClick={() => this.onCreate()}>Create {this.type}</CreateBtn>
          <ConfirmBtn
            disabled={!this.canConfirm}
            visible={this.isConfirming}
            onClick={() => this.onConfirm()}
            onBack={() => this.onBack()}>Upload {this.type}</ConfirmBtn>

          { this.renderForm() }

        </div>
      </Fragment>
    )
  } // render
} // class CreatePhoto

function CreateBtn({disabled, visible, onClick, children}) {
  return (
    <div className={'container-fluid ' + (!visible ? 'd-none' : '')}>
      <div className="row">
        <button
          type="submit"
          disabled={disabled}
          className="btn btn-primary offset-md-10 col-md-2"
          onClick={onClick}
        >{children} &raquo;&raquo;</button>
      </div>
    </div>
  );
} // CreateBtn

function ConfirmBtn({disabled, visible, onClick, onBack, children}) {
  return (
    <div className={'container-fluid ' + (!visible ? 'd-none' : '')}>
      <div className="row">
        <button
          type="submit"
          disabled={disabled}
          className="btn btn-secondary col-md-2"
          onClick={onBack}
        >&laquo;&laquo; Back</button>
        <button
          type="submit"
          disabled={disabled}
          className="btn btn-success offset-md-8 col-md-2"
          onClick={onClick}
        >{children}</button>
      </div>
    </div>
  );
} // CreateBtn

export default CreatePhoto;
