import React, {PureComponent} from 'react';
import {Checkbox, Col, Input, InputNumber, Row, Select, Switch, Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons'
import './schemaJson.css';
import _ from 'underscore';
import AceEditor from '../AceEditor/AceEditor.jsx';
import LocalProvider from '../LocalProvider/index.jsx';
import {SchemaContext} from '../../SchemaContext.js';

const { TextArea } = Input;
const Option = Select.Option;

const changeOtherValue = (value, name, data, change) => {
  data[name] = value;
  if (change) change(data);
};

class SchemaString extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: _.isUndefined(props.data.enum) ? false : true
    };
  }

  static contextType = SchemaContext;

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data.enum !== undefined && prevState.prevEnum !== nextProps.data.enum) {
      return {
        checked: !_.isUndefined(nextProps.data.enum),
        prevEnum: nextProps.data.enum
      };
    }
    return null;
  }

  changeOtherValue = (value, name, data) => {
    data[name] = value;
    const context = this.context || {};
    if (context.changeCustomValue) context.changeCustomValue(data);
  };

  changeEnumOtherValue = (value, data) => {
    var arr = value.split('\n');
    const context = this.context || {};
    if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
      delete data.enum;
      if (context.changeCustomValue) context.changeCustomValue(data);
    } else {
      data.enum = arr;
      if (context.changeCustomValue) context.changeCustomValue(data);
    }
  };

  changeEnumDescOtherValue = (value, data) => {
    data.enumDesc = value;
    const context = this.context || {};
    if (context.changeCustomValue) context.changeCustomValue(data);
  };

  onChangeCheckBox = (checked, data) => {
    this.setState({
      checked
    });
    if (!checked) {
      delete data.enum;
      const context = this.context || {};
      if (context.changeCustomValue) context.changeCustomValue(data);
    }
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('default')}
          </Col>
          <Col span={20}>
            <Input
              value={data.default}
              placeholder={LocalProvider('default')}
              onChange={e => this.changeOtherValue(e.target.value, 'default', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" align="middle">
          <Col span={12}>
            <Row align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('minLength')}
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.minLength}
                  placeholder="min.length"
                  onChange={e => this.changeOtherValue(e, 'minLength', data)}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('maxLength')}
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.maxLength}
                  placeholder="max.length"
                  onChange={e => this.changeOtherValue(e, 'maxLength', data)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            <span>
              Pattern&nbsp;
              <Tooltip title={LocalProvider('pattern')}>
                <QuestionCircleOutlined type="question-circle-o" style={{ width: '10px' }} />
              </Tooltip>
              &nbsp; :
            </span>
          </Col>
          <Col span={20}>
            <Input
              value={data.pattern}
              placeholder="Pattern"
              onChange={e => this.changeOtherValue(e.target.value, 'pattern', data)}
            />
          </Col>
        </Row>
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            <span>
              {LocalProvider('enum')}
              <Checkbox
                checked={this.state.checked}
                onChange={e => this.onChangeCheckBox(e.target.checked, data)}
              />{' '}
              :
            </span>
          </Col>
          <Col span={20}>
            <TextArea
              value={data.enum && data.enum.length && data.enum.join('\n')}
              disabled={!this.state.checked}
              placeholder={LocalProvider('enum_msg')}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onChange={e => {
                this.changeEnumOtherValue(e.target.value, data);
              }}
            />
          </Col>
        </Row>
        {this.state.checked && (
          <Row className="other-row" align="middle">
            <Col span={4} className="other-label">
              <span>{LocalProvider('enum_desc')}</span>
            </Col>
            <Col span={20}>
              <TextArea
                value={data.enumDesc}
                disabled={!this.state.checked}
                placeholder={LocalProvider('enum_desc_msg')}
                autoSize={{ minRows: 2, maxRows: 6 }}
                onChange={e => {
                  this.changeEnumDescOtherValue(e.target.value, data);
                }}
              />
            </Col>
          </Row>
        )}
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            <span>format :</span>
          </Col>
          <Col span={20}>
            <Select
              showSearch
              style={{ width: 150 }}
              value={data.format}
              dropdownClassName="json-schema-react-editor-adv-modal-select"
              placeholder="Select a format"
              optionFilterProp="children"
              optionLabelProp="value"
              onChange={e => this.changeOtherValue(e, 'format', data)}
              filterOption={(input, option) => {
                return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {(this.context?.Model?.__jsonSchemaFormat || []).map(item => {
                return (
                  <Option value={item.name} key={item.name}>
                    {item.name} <span className="format-items-title">{item.title}</span>
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
      </div>
    );
  }
}

class SchemaNumber extends PureComponent {
  constructor(props) {
    super(props);
    const enumStr = _.isUndefined(props.data.enum) ? '' : props.data.enum.join('\n');
    this.state = {
      checked: _.isUndefined(props.data.enum) ? false : true,
      enum: enumStr,
      prevEnum: props.data.enum
    };
  }

  static contextType = SchemaContext;

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextEnumStr = _.isUndefined(nextProps.data.enum) ? '' : nextProps.data.enum.join('\n');
    const prevEnumStr = _.isUndefined(prevState.prevEnum) ? '' : prevState.prevEnum.join('\n');
    if (nextEnumStr !== prevEnumStr) {
      return {
        enum: nextEnumStr,
        prevEnum: nextProps.data.enum
      };
    }
    return null;
  }

  onChangeCheckBox = (checked, data) => {
    this.setState({
      checked
    });

    if (!checked) {
      delete data.enum;
      this.setState({ enum: '' });
      const context = this.context || {};
      if (context.changeCustomValue) context.changeCustomValue(data);
    }
  };

  changeEnumOtherValue = (value, data) => {
    this.setState({ enum: value });
    var arr = value.split('\n');
    const context = this.context || {};
    if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
      delete data.enum;
      if (context.changeCustomValue) context.changeCustomValue(data);
    } else {
      data.enum = arr.map(item => +item);
      if (context.changeCustomValue) context.changeCustomValue(data);
    }
  };

  onEnterEnumOtherValue = (value, data) => {
    let arr = value.split('\n').map(item => +item);
    data.enum = arr;
    const context = this.context || {};
    if (context.changeCustomValue) context.changeCustomValue(data);
  };

  changeEnumDescOtherValue = (value, data) => {
    data.enumDesc = value;
    const context = this.context || {};
    if (context.changeCustomValue) context.changeCustomValue(data);
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        <div className="default-setting">{LocalProvider('base_setting')}</div>
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            {LocalProvider('default')}
          </Col>
          <Col span={20}>
            <Input
              value={data.default}
              placeholder={LocalProvider('default')}
              onChange={e =>
                changeOtherValue(e.target.value, 'default', data, (this.context || {}).changeCustomValue)
              }
            />
          </Col>
        </Row>
        <Row className="other-row" align="middle">
          <Col span={12}>
            <Row align="middle">
              <Col span={13} className="other-label">
                <span>
                  exclusiveMinimum&nbsp;
                  <Tooltip title={LocalProvider('exclusiveMinimum')}>
                    <QuestionCircleOutlined type="question-circle-o" style={{ width: '10px' }} />
                  </Tooltip>
                  &nbsp; :
                </span>
              </Col>
              <Col span={11}>
                <Switch
                  checked={data.exclusiveMinimum}
                  placeholder="exclusiveMinimum"
                  onChange={e =>
                    changeOtherValue(e, 'exclusiveMinimum', data, (this.context || {}).changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row align="middle">
              <Col span={13} className="other-label">
                <span>
                  exclusiveMaximum&nbsp;
                  <Tooltip title={LocalProvider('exclusiveMaximum')}>
                    <QuestionCircleOutlined type="question-circle-o" style={{ width: '10px' }} />
                  </Tooltip>
                  &nbsp; :
                </span>
              </Col>
              <Col span={11}>
                <Switch
                  checked={data.exclusiveMaximum}
                  placeholder="exclusiveMaximum"
                  onChange={e =>
                    changeOtherValue(e, 'exclusiveMaximum', data, (this.context || {}).changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" align="middle">
          <Col span={12}>
            <Row align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('minimum')}
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.minimum}
                  placeholder={LocalProvider('minimum')}
                  onChange={e =>
                    changeOtherValue(e, 'minimum', data, (this.context || {}).changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row align="middle">
              <Col span={8} className="other-label">
                {LocalProvider('maximum')}
              </Col>
              <Col span={16}>
                <InputNumber
                  value={data.maximum}
                  placeholder={LocalProvider('maximum')}
                  onChange={e =>
                    changeOtherValue(e, 'maximum', data, (this.context || {}).changeCustomValue)
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="other-row" align="middle">
          <Col span={4} className="other-label">
            <span>
              {LocalProvider('enum')}
              <Checkbox
                checked={this.state.checked}
                onChange={e => this.onChangeCheckBox(e.target.checked, data)}
              />{' '}
              :
            </span>
          </Col>
          <Col span={20}>
            <TextArea
              // value={data.enum && data.enum.length && data.enum.join('\n')}
              value={this.state.enum}
              disabled={!this.state.checked}
              placeholder={LocalProvider('enum_msg')}
              autoSize={{ minRows: 2, maxRows: 6 }}
              onChange={e => {
                this.changeEnumOtherValue(e.target.value, data);
              }}
            />
          </Col>
        </Row>
        {this.state.checked && (
          <Row className="other-row" align="middle">
            <Col span={4} className="other-label">
              <span>{LocalProvider('enum_desc')}</span>
            </Col>
            <Col span={20}>
              <TextArea
                value={data.enumDesc}
                disabled={!this.state.checked}
                placeholder={LocalProvider('enum_desc_msg')}
                autoSize={{ minRows: 2, maxRows: 6 }}
                onChange={e => {
                  this.changeEnumDescOtherValue(e.target.value, data);
                }}
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const SchemaBoolean = (props) => {
  const { data } = props;
  const context = React.useContext(SchemaContext) || {};
  let value = _.isUndefined(data.default) ? '' : data.default ? 'true' : 'false';
  return (
    <div>
      <div className="default-setting">{LocalProvider('base_setting')}</div>
      <Row className="other-row" align="middle">
        <Col span={4} className="other-label">
          {LocalProvider('default')}
        </Col>
        <Col span={20}>
          <Select
            value={value}
            onChange={e =>
              changeOtherValue(
                e === 'true' ? true : false,
                'default',
                data,
                context.changeCustomValue
              )
            }
            style={{ width: 200 }}
          >
            <Option value="true">true</Option>
            <Option value="false">false</Option>
          </Select>
        </Col>
      </Row>
    </div>
  );
};

const SchemaArray = (props) => {
  const { data } = props;
  const context = React.useContext(SchemaContext) || {};
  return (
    <div>
      <div className="default-setting">{LocalProvider('base_setting')}</div>
      <Row className="other-row" align="middle">
        <Col span={6} className="other-label">
          <span>
            uniqueItems&nbsp;
            <Tooltip title={LocalProvider('unique_items')}>
              <QuestionCircleOutlined type="question-circle-o" style={{ width: '10px' }} />
            </Tooltip>
            &nbsp; :
          </span>
        </Col>
        <Col span={18}>
          <Switch
            checked={data.uniqueItems}
            placeholder="uniqueItems"
            onChange={e => changeOtherValue(e, 'uniqueItems', data, context.changeCustomValue)}
          />
        </Col>
      </Row>
      <Row className="other-row" align="middle">
        <Col span={12}>
          <Row align="middle">
            <Col span={12} className="other-label">
              {LocalProvider('min_items')}
            </Col>
            <Col span={12}>
              <InputNumber
                value={data.minItems}
                placeholder="minItems"
                onChange={e => changeOtherValue(e, 'minItems', data, context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row align="middle">
            <Col span={12} className="other-label">
              {LocalProvider('max_items')}
            </Col>
            <Col span={12}>
              <InputNumber
                value={data.maxItems}
                placeholder="maxItems"
                onChange={e => changeOtherValue(e, 'maxItems', data, context.changeCustomValue)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const mapping = data => {
  return {
    string: <SchemaString data={data} />,
    number: <SchemaNumber data={data} />,
    boolean: <SchemaBoolean data={data} />,
    integer: <SchemaNumber data={data} />,
    array: <SchemaArray data={data} />
  }[data.type];
};

const handleInputEditor = (e, change) => {
  if (!e.text) return;
  if (change) change(e.jsonData);
};

const CustomItem = (props) => {
  const { data } = props;
  const context = React.useContext(SchemaContext) || {};

  // 使用 state 来管理内部数据，确保双向绑定
  const [jsonData, setJsonData] = React.useState(() => {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse data:', e);
      return {};
    }
  });

  // 当外部 data prop 改变时，更新内部状态
  React.useEffect(() => {
    try {
      const parsedData = JSON.parse(data);
      setJsonData(parsedData);
    } catch (e) {
      console.error('Failed to parse data in useEffect:', e);
    }
  }, [data]);

  // 当 JSON 编辑器内容改变时，更新内部状态并通知父组件
  const handleJsonChange = (e) => {
    if (!e.text) return;
    setJsonData(e.jsonData);
    if (context.changeCustomValue) {
      context.changeCustomValue(e.jsonData);
    }
  };

  // 创建一个包装的 context，拦截 changeCustomValue 调用
  const wrappedContext = React.useMemo(() => ({
    ...context,
    changeCustomValue: (newData) => {
      setJsonData(newData);
      if (context.changeCustomValue) {
        context.changeCustomValue(newData);
      }
    }
  }), [context]);

  const optionForm = mapping(jsonData);

  return (
    <SchemaContext.Provider value={wrappedContext}>
      <div>
        <div>{optionForm}</div>
        <div className="default-setting">{LocalProvider('all_setting')}</div>
        <AceEditor
          data={JSON.stringify(jsonData, null, 2)}
          mode="json"
          onChange={handleJsonChange}
        />
      </div>
    </SchemaContext.Provider>
  );
};

export default CustomItem;
