import React, { PureComponent } from 'react'

class Field extends PureComponent {
  handleChange(event) {
    if (this.props.onValue)
      this.props.onValue(event.target.value);
  } // handleChange

  handleKeyPress(event) {
    if (event.key === 'Enter' && this.props.onEnter)
      this.props.onEnter();
  }

  render() {
    if (this.props.type === 'select')
      return this.renderSelect();
    return this.renderInput();
  }

  renderInput() {
    return (
      <div className={`container-fluid ${this.props.className}`}>
        <div className='row'>
          {
            this.props.title && <label className='col-md-2'>{this.props.title}</label>
          }
          <input
            type='text'
            className={`form-control ${this.props.size === 'small' ? 'col-md-4' : 'col-md'}`}
            placeholder={this.props.placeholder}
            value={this.props.value}
            disabled={this.props.disabled}
            onChange={event => this.handleChange(event)}
            onKeyPress={event => this.handleKeyPress(event)}/>
        </div>
      </div>
    )
  } // render

  renderSelect() {
    return (
      <div className={`container-fluid ${this.props.className}`}>
        <div className='row'>
          {
            this.props.title && <label className='col-md-2'>{this.props.title}</label>
          }
          <select
            className={`form-control ${this.props.size === 'small' ? 'col-md-4' : 'col-md'}`}
            disabled={this.props.disabled}
            onChange={event => this.handleChange(event)}
            >
            {
              this.props.values.map(
                ([label, value]) => <option key={value} value={value}>{label}</option>
              )
            }
          </select>
        </div>
      </div>
    )
  }
} // class Field

export default Field;
