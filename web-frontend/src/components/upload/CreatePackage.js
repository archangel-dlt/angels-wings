import React, { Component, Fragment } from 'react';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify'

class CreatePackage extends Component {
  constructor(props, fingerprint = null, data = null) {
    super(props);

    this.state = {
      step: 'creating',
      fingerprint: fingerprint,
      data: data,
      count: 0
    }
  } // constructor

  reset() {
    this.setState({ count: this.count + 1 });
    this.updateCanCreate(null, null);
  } // reset
  get count() { return this.state.count; }

  onData(data) { this.updateCanCreate(data, this.state.fingerprint); }
  onFiles(fingerprint) { this.updateCanCreate(this.state.data, fingerprint); }
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

    const payload = this.preparePayload(timestamp, data, fingerprint);

    /*this.props.driver.store(data.key, payload)
      .transaction(() => { toast(`${this.type} submitted`); this.reset(); })
      .then(() => toast.success(`${this.type} written to blockchain`))
      .catch(err => {
        toast.error(`${err}`);
        if (this.isConfirming)
          this.setState({ step: 'canConfirm' });
      });
     */
    alert(JSON.stringify(payload));
  } // upload

  get isCreating() { return (this.state.step === 'canCreate') || (this.state.step === 'creating') }
  get canCreate() { return this.state.step === 'canCreate'; }
  get isConfirming() { return (this.state.step === 'canConfirm') || (this.state.step === 'uploading') }
  get canConfirm() { return this.state.step === 'canConfirm'; }

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
} // class CreatePackage

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

export default CreatePackage;
