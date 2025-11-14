import React from 'react';
import {AutoComplete, Input} from 'antd';
import {EditOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';
import LocaleProvider from '../LocalProvider/index.jsx';
import {SchemaContext} from '../../SchemaContext.js';

export default class MockSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mock: ''
    };
  }

  static contextType = SchemaContext;

  static propTypes = {
    schema: PropTypes.object,
    showEdit: PropTypes.func,
    onChange: PropTypes.func
  };

  render() {
    const { schema } = this.props;
    const context = this.context || {};
    const mock = context.Model?.__jsonSchemaMock || [];
    const options = mock.map((item) => ({ value: item.mock, label: item.mock }));

    return (
      <div>
        <AutoComplete
          className="certain-category-search"
          dropdownMatchSelectWidth={false}
          options={options}
          placeholder={LocaleProvider('mock')}
          value={schema.mock ? schema.mock.mock : ''}
          onChange={this.props.onChange}
          disabled={schema.type === 'object' || schema.type === 'array'}
        >
          <Input addonAfter={<EditOutlined onClick={(e) => {e.stopPropagation(); this.props.showEdit()}} />} />
        </AutoComplete>
      </div>
    );
  }
}
