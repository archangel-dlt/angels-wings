import React, {Fragment, PureComponent} from 'react';
import Field from './Field';
import cloneDeep from 'lodash.clonedeep';
import uuid from "uuid/v1";

const key = 'key';
const pack = 'pack';
const title = 'title';
const description = 'description';
const supplier = 'supplier';
const referenceUrl = 'referenceUrl';
const reliability = 'reliability';

const realOrFake = [
  [ 'Yes, true image', true ],
  [ 'No, this image has been falisified', false ]
]

const photoFields = [
  { title: 'Title', field: title },
  { title: 'Description', field: description },
  { title: '--'},
  { title: 'Source', field: supplier, optional: true },
  { title: 'URL', field: referenceUrl, optional: true },
  { title: '--' },
  { title: 'Is this image reliable?', field: reliability, type: 'select', values: realOrFake },
  { title: '--' },
  { title: 'Filename', field: 'filename', readonly: true }
];

class PhotoPackage extends PureComponent {
  constructor(props) {
    super(props);
    this[key] = uuid();
    this[pack] = 'photo';
    this.fields = cloneDeep(photoFields);

    if (this.props.initialData)
      this.fieldNames.forEach(name => this[name] = this.props.initialData[name]);

    if (this.props.display) {
      const t = this.fields.findIndex(f => f.field === title)
      const condition = () => !!this.props.initialData[title]
      this.fields[t].condition = condition
      if (this.fields[t+1].title === '--')
        this.fields[t+1].condition = condition
    }
  }

  get onData() { return this.props.onData; }

  get fieldNames() { return this.fields.filter(f => !!f.field).map(f => f.field) }
  get mandatoryFieldNames() { return this.fields.filter(f => !!f.field).filter(f => !f.optional).map(f => f.field) }
  get dataReady() {
    return this.mandatoryFieldNames.reduce((acc, name) => acc && !!this[name], true);
  } // get

  get data() {
    const d = {
      [key]: this[key],
      [pack]: this[pack],
    }

    this.fieldNames.forEach(name => d[name] = this[name]);

    return d;
  } // data

  setData(data) {
    for (const n of this.fieldNames) {
      if (data[n]) {
        this[`${n}-field`].setValue(data[n])
      }
    }
    this.key = data.key
  }
  update(field, value) {
    this[field] = value

    this.onData(this.dataReady ? this.data : null);
  } // update

  renderFields() {
    return this.fields.map((field, i) => {
      if (field.condition && !field.condition())
        return (<span key={i}/>)

      if (field.title === '--')
        return (<br key={i}/>)

      const initialData = this.props.initialData ? this.props.initialData[field.field] : null;
      const value = this[field.field] ? this[field.field] : initialData;

      return (
        <Field
          key={i}
          title={field.title}
          size={field.length}
          onValue={v => this.update(field.field, v)}
          ref={f => this[`${field.field}-field`] = f}
          disabled={this.props.readonly || field.readonly}
          value={value}
          type={field.type}
          values={field.values}/>
      )
    });
  } // renderFields

  render() {
    return (<Fragment>
      { this.renderFields() }
    </Fragment>)
  }
} // class PhotoPackage

export default PhotoPackage;
