import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Input} from 'antd'

export default class FieldInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
      value: props.value
    }
  }

  handleChange =(e)=>{
    let value = e.target.value;
    this.setState({
      value
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value && nextProps.value !== prevState.prevPropsValue) {
      return {
        value: nextProps.value,
        prevPropsValue: nextProps.value
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        prevPropsValue: this.props.value
      });
    }
  }

  onKeyup= e=> {
    if(e.keyCode === 13) {
      if(e.target.value !== this.props.value)return this.props.onChange(e)
    }
  }

  handleBlur = (e)=>{
    if(e.target.value !== this.props.value)return this.props.onChange(e)
  }

  render() {
    const {value} = this.state;

    return (
      <Input  {...this.props} value={value} onKeyUp={this.onKeyup} onBlur={this.handleBlur} onChange={this.handleChange} />
    )
  }
}
