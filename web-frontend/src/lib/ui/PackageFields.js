import React, {Fragment, PureComponent} from 'react';
import Field from './Field';
import cloneDeep from 'lodash.clonedeep';

const key = 'key';
const pack = 'pack';
const title = 'title';

class PackageFields extends PureComponent {
  constructor(props, fields) {
    super(props);
    this.fields = cloneDeep(fields);

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
  get dataReady() {
    return this.fieldNames.reduce((acc, name) => acc && !!this[name], true)
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

      const value = this.props.initialData ? this.props.initialData[field.field] : null

      return (
        <Field
          key={i}
          title={field.title}
          size={field.length}
          onValue={v => this.update(field.field, v)}
          ref={f => this[`${field.field}-field`] = f}
          disabled={this.props.readonly}
          initialValue={value}/>
      )
    });
  } // renderFields

  render() {
    return (<Fragment>
      { this.renderFields() }
    </Fragment>)
  }
} // Class PackageFields

const Required = {
  title,
  key,
  pack
}
export { PackageFields, Required }
