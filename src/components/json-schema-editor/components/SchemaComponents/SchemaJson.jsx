import React, {PureComponent} from 'react';
import {Checkbox, Col, Dropdown, Form, Input, message, Row, Select, Tooltip} from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import FieldInput from './FieldInput'
import './schemaJson.css';
import _ from 'underscore';
import {useSelector} from 'react-redux';
import {JSONPATH_JOIN_CHAR, SCHEMA_TYPE} from '../../utils.js';
import LocaleProvider from '../LocalProvider/index.jsx';
import MockSelect from '../MockSelect/index.jsx';
import {SchemaContext} from '../../SchemaContext.js';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const InputGroup = Input.Group;

const mapping = (name, data, showEdit, showAdv, contextValue) => {
  switch (data.type) {
    case 'array':
      return <SchemaArray prefix={name} data={data} showEdit={showEdit} showAdv={showAdv} contextValue={contextValue} />;
      break;
    case 'object':
      let nameArray = [].concat(name, 'properties');
      return <SchemaObject prefix={nameArray} data={data} showEdit={showEdit} showAdv={showAdv} contextValue={contextValue} />;
      break;
    default:
      return null;
  }
};

class SchemaArray extends PureComponent {
  constructor(props) {
    super(props);
    const { prefix } = props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    };
  }

  static contextType = SchemaContext;

  getPrefix() {
    return [].concat(this.props.prefix, 'items');
  }

  getModel() {
    // 优先使用 props 传递的 contextValue，如果没有则使用 context
    const context = this.props.contextValue || this.context || {};
    const model = context?.Model?.schema || {};
    if (!model.changeTypeAction && !this.props.contextValue) {
      console.warn('SchemaArray: Model methods not available', { context: this.context, props: this.props });
    }
    return model;
  }

  getContext() {
    // 优先使用 props 传递的 contextValue，如果没有则使用 context
    return this.props.contextValue || this.context || {};
  }

  // 修改数据类型
  handleChangeType = value => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'type');
    const model = this.getModel();
    if (model.changeTypeAction) model.changeTypeAction({ key, value });
  };

  // 修改备注信息
  handleChangeDesc = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `description`);
    let value = e.target.value;
    const model = this.getModel();
    if (model.changeValueAction) model.changeValueAction({ key, value });
  };

  // 修改mock信息
  handleChangeMock = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : '';
    const model = this.getModel();
    if (model.changeValueAction) model.changeValueAction({ key, value });
  };

  handleChangeTitle = e =>{
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `title`);
    let value = e.target.value;
    const model = this.getModel();
    if (model.changeValueAction) model.changeValueAction({ key, value });
  }

  // 增加子节点
  handleAddChildField = () => {
    let prefix = this.getPrefix();
    let keyArr = [].concat(prefix, 'properties');
    const model = this.getModel();
    if (model.addChildFieldAction) model.addChildFieldAction({ key: keyArr });
    if (model.setOpenValueAction) model.setOpenValueAction({ key: keyArr, value: true });
  };

  handleClickIcon = () => {
    let prefix = this.getPrefix();
    // 数据存储：properties.name.properties
    let keyArr = [].concat(prefix, 'properties');
    const model = this.getModel();
    if (model.setOpenValueAction) model.setOpenValueAction({ key: keyArr });
  };

  handleShowEdit = (name, type) => {
    let prefix = this.getPrefix();
    this.props.showEdit(prefix, name, this.props.data.items[name], type);
  };

  handleShowAdv = () => {
    this.props.showAdv(this.getPrefix(), this.props.data.items);
  };

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    const context = this.getContext();
    const items = data.items;
    let prefixArray = [].concat(prefix, 'items');

    let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
    let showIcon = context.getOpenValue ? context.getOpenValue([prefixArrayStr]) : true;
    return (
      !_.isUndefined(data.items) && (
        <div className="array-type">
          <Row className="array-item-type" justify="space-around" align="middle">
            <Col
              span={8}
              className="col-item name-item col-item-name"
              style={this.__tagPaddingLeftStyle}
            >
              <Row justify="space-around" align="middle">
                <Col span={2} className="down-style-col">
                  {items.type === 'object' ? (
                    <span className="down-style" onClick={this.handleClickIcon}>
                      {showIcon ? (
                        <CaretDownOutlined className="icon-object" type="caret-down" />
                      ) : (
                        <CaretRightOutlined className="icon-object" type="caret-right" />
                      )}
                    </span>
                  ) : null}
                </Col>
                <Col span={22}>
                  <Input addonAfter={<Checkbox disabled />} disabled value="Items" />
                </Col>
              </Row>
            </Col>
            <Col span={3} className="col-item col-item-type">
              <Select
                name="itemtype"
                className="type-select-style"
                onChange={this.handleChangeType}
                value={items.type}
              >
                {SCHEMA_TYPE.map((item, index) => {
                  return (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            {(context.isMock || false) && (
              <Col span={3} className="col-item col-item-mock">

                <MockSelect
                  schema={items}
                  showEdit={() => this.handleShowEdit('mock', items.type)}
                  onChange={this.handleChangeMock}
                />
              </Col>
            )}
            <Col span={(context.isMock || false) ? 4 : 5} className="col-item col-item-mock">
              <Input
                addonAfter={<EditOutlined type="edit" onClick={() => this.handleShowEdit('title')} />}
                placeholder={LocaleProvider('title')}
                value={items.title}
                onChange={this.handleChangeTitle}
              />
            </Col>
            <Col span={(context.isMock || false) ? 4 : 5} className="col-item col-item-desc">
              <Input
                addonAfter={<EditOutlined type="edit" onClick={() => this.handleShowEdit('description')} />}
                placeholder={LocaleProvider('description')}
                value={items.description}
                onChange={this.handleChangeDesc}
              />
            </Col>
            <Col span={(context.isMock || false) ? 2: 3} className="col-item col-item-setting">
              <span className="adv-set" onClick={this.handleShowAdv}>
                <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                  <SettingOutlined type="setting" />
                </Tooltip>
              </span>

              {items.type === 'object' ? (
                <span onClick={this.handleAddChildField}>
                  <Tooltip placement="top" title={LocaleProvider('add_child_node')}>
                    <PlusOutlined type="plus" className="plus" />
                  </Tooltip>
                </span>
              ) : null}
            </Col>
          </Row>
          <div className="option-formStyle">{mapping(prefixArray, items, showEdit, showAdv)}</div>
        </div>
      )
    );
  }
}


class SchemaItem extends PureComponent {
  constructor(props) {
    super(props);
    const { prefix } = props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    };
  }

  static contextType = SchemaContext;

  getPrefix() {
    return [].concat(this.props.prefix, this.props.name);
  }

  getModel() {
    // 优先使用 props 传递的 contextValue，如果没有则使用 context
    const context = this.props.contextValue || this.context || {};
    const model = context?.Model?.schema || {};
    if (!model.changeNameAction && !this.props.contextValue) {
      console.warn('SchemaItem: Model methods not available', { context: this.context, props: this.props });
    }
    return model;
  }

  getContext() {
    // 优先使用 props 传递的 contextValue，如果没有则使用 context
    return this.props.contextValue || this.context || {};
  }

  // 修改节点字段名
  handleChangeName = e => {
    const { data, prefix, name } = this.props;
    let value = e.target.value;

    if (data.properties[value] && typeof data.properties[value] === 'object') {
      return message.error(`The field "${value}" already exists.`);
    }

    const model = this.getModel();
    if (model.changeNameAction) model.changeNameAction({ value, prefix, name });
  };

  // 修改备注信息
  handleChangeDesc = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'description');
    let value = e.target.value;
    const model = this.getModel();
    if (model.changeValueAction) model.changeValueAction({ key, value });
  };

  // 修改mock 信息
  handleChangeMock = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : '';
    const model = this.getModel();
    if (model.changeValueAction) model.changeValueAction({ key, value });
  };

  handleChangeTitle = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `title`);
    let value = e.target.value;
    const model = this.getModel();
    if (model.changeValueAction) model.changeValueAction({ key, value });
  }

  // 修改数据类型
  handleChangeType = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'type');
    const model = this.getModel();
    if (model.changeTypeAction) model.changeTypeAction({ key, value: e });
  };

  // 删除节点
  handleDeleteItem = () => {
    const { prefix, name } = this.props;
    let nameArray = this.getPrefix();
    const model = this.getModel();
    if (model.deleteItemAction) model.deleteItemAction({ key: nameArray });
    if (model.enableRequireAction) model.enableRequireAction({ prefix, name, required: false });
  };
  /*
  展示备注编辑弹窗
  editorName: 弹窗名称 ['description', 'mock']
  type: 如果当前字段是object || array showEdit 不可用
  */
  handleShowEdit = (editorName, type) => {
    const { data, name, showEdit } = this.props;

    showEdit(this.getPrefix(), editorName, data.properties[name][editorName], type);
  };

  // 展示高级设置弹窗
  handleShowAdv = () => {
    const { data, name, showAdv } = this.props;
    showAdv(this.getPrefix(), data.properties[name]);
  };

  //  增加子节点
  handleAddField = () => {
    const { prefix, name } = this.props;
    const model = this.getModel();
    if (model.addFieldAction) model.addFieldAction({ prefix, name });
  };

  // 控制三角形按钮
  handleClickIcon = () => {
    let prefix = this.getPrefix();
    // 数据存储：properties.xxx.properties 结构
    let keyArr = [].concat(prefix, 'properties');
    const model = this.getModel();
    if (model.setOpenValueAction) model.setOpenValueAction({ key: keyArr });
  };

  // 修改是否必须
  handleEnableRequire = e => {
    const { prefix, name } = this.props;
    let required = e.target.checked;
    // this.enableRequire(this.props.prefix, this.props.name, e.target.checked);
    const model = this.getModel();
    if (model.enableRequireAction) model.enableRequireAction({ prefix, name, required });
  };

  render() {
    let { name, data, prefix, showEdit, showAdv } = this.props;
    let value = data.properties[name];
    let prefixArray = [].concat(prefix, name);

    const context = this.getContext();
    let prefixStr = prefix.join(JSONPATH_JOIN_CHAR);
    let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
    let show = context.getOpenValue ? context.getOpenValue([prefixStr]) : true;
    let showIcon = context.getOpenValue ? context.getOpenValue([prefixArrayStr]) : true;
    return show ? (
      <div>
        <Row justify="space-around" align="middle">
          <Col
            span={8}
            className="col-item name-item col-item-name"
            style={this.__tagPaddingLeftStyle}
          >
            <Row justify="space-around" align="middle">
              <Col span={2} className="down-style-col">
                {value.type === 'object' ? (
                  <span className="down-style" onClick={this.handleClickIcon}>
                    {showIcon ? (
                      <CaretDownOutlined className="icon-object" type="caret-down" />
                    ) : (
                      <CaretRightOutlined className="icon-object" type="caret-right" />
                    )}
                  </span>
                ) : null}
              </Col>
              <Col span={22}>
                <FieldInput
                  addonAfter={
                    <Tooltip placement="top" title={LocaleProvider('required')}>
                      <Checkbox
                        onChange={this.handleEnableRequire}
                        checked={
                          _.isUndefined(data.required) ? false : data.required.indexOf(name) != -1
                        }
                      />
                    </Tooltip>
                  }
                  onChange={this.handleChangeName}
                  value={name}
                />
              </Col>
            </Row>
          </Col>


          <Col span={3} className="col-item col-item-type">
            <Select
              className="type-select-style"
              onChange={this.handleChangeType}
              value={value.type}
            >
              {SCHEMA_TYPE.map((item, index) => {
                return (
                  <Option value={item} key={index}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Col>


          {(context.isMock || false) && (
            <Col span={3} className="col-item col-item-mock">
              {/* <Input
                addonAfter={
                  <Icon type="edit" onClick={() => this.handleShowEdit('mock', value.type)} />
                }
                placeholder={LocaleProvider('mock')}
                value={value.mock ? value.mock.mock : ''}
                onChange={this.handleChangeMock}
                disabled={value.type === 'object' || value.type === 'array'}
              /> */}
              <MockSelect
                schema={value}
                showEdit={() => this.handleShowEdit('mock', value.type)}
                onChange={this.handleChangeMock}
              />
            </Col>
          )}

          <Col span={(context.isMock || false) ? 4 : 5} className="col-item col-item-mock">
            <Input
              addonAfter={<EditOutlined type="edit" onClick={() => this.handleShowEdit('title')} />}
              placeholder={LocaleProvider('title')}
              value={value.title}
              onChange={this.handleChangeTitle}
            />
          </Col>

          <Col span={(context.isMock || false) ? 4 : 5} className="col-item col-item-desc">
            <Input
              addonAfter={<EditOutlined type="edit" onClick={() => this.handleShowEdit('description')} />}
              placeholder={LocaleProvider('description')}
              value={value.description}
              onChange={this.handleChangeDesc}
            />
          </Col>


          <Col span={(context.isMock || false) ? 2: 3}  className="col-item col-item-setting">
            <span className="adv-set" onClick={this.handleShowAdv}>
              <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                <SettingOutlined type="setting" />
              </Tooltip>
            </span>
            <span className="delete-item" onClick={this.handleDeleteItem}>
              <CloseOutlined type="close" className="close" />
            </span>
            {value.type === 'object' ? (
              <DropPlus prefix={prefix} name={name} />
            ) : (
              <span onClick={this.handleAddField}>
                <Tooltip placement="top" title={LocaleProvider('add_sibling_node')}>
                  <PlusOutlined type="plus" className="plus" />
                </Tooltip>
              </span>
            )}
          </Col>
        </Row>
        <div className="option-formStyle">{mapping(prefixArray, value, showEdit, showAdv)}</div>
      </div>
    ) : null;
  }
}


const SchemaObject = React.memo((props) => {
  const { data, prefix, showEdit, showAdv, contextValue } = props;
  const open = useSelector(state => state.schema.open);

  return (
    <div className="object-style">
      {Object.keys(data.properties).map((name, index) => (
        <SchemaItem
          key={index}
          data={data}
          name={name}
          prefix={prefix}
          showEdit={showEdit}
          showAdv={showAdv}
          contextValue={contextValue}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    _.isEqual(nextProps.data, prevProps.data) &&
    _.isEqual(nextProps.prefix, prevProps.prefix)
  );
});

const DropPlus = (props) => {
  const { prefix, name, add } = props;
  const context = React.useContext(SchemaContext) || {};
  const Model = context.Model?.schema || {};

  const handleAddSibling = () => {
    console.log('handleAddSibling called', { prefix, name, Model, context });
    if (Model.addFieldAction) {
      Model.addFieldAction({ prefix, name });
    } else {
      console.warn('Model.addFieldAction is not available', context);
    }
  };

  const handleAddChild = () => {
    const key = [].concat(prefix, name, 'properties');
    console.log('handleAddChild called', { key, Model, context });
    if (Model.setOpenValueAction) {
      Model.setOpenValueAction({ key, value: true });
    }
    if (Model.addChildFieldAction) {
      Model.addChildFieldAction({ key });
    } else {
      console.warn('Model.addChildFieldAction is not available', context);
    }
  };

  const menu = {
    items: [
      {
        key: 'sibling',
        label: (
          <span onClick={handleAddSibling}>
            {LocaleProvider('sibling_node')}
          </span>
        )
      },
      {
        key: 'child',
        label: (
          <span onClick={handleAddChild}>
            {LocaleProvider('child_node')}
          </span>
        )
      }
    ]
  };

  return (
    <Tooltip placement="top" title={LocaleProvider('add_node')}>
      <Dropdown menu={menu}>
        <PlusOutlined type="plus" className="plus" />
      </Dropdown>
    </Tooltip>
  );
};

const SchemaJson = props => {
  // 从 Context 获取值并传递给子组件
  const contextValue = React.useContext(SchemaContext) || {};
  const item = mapping([], props.data, props.showEdit, props.showAdv, contextValue);
  return <div className="schema-content">{item}</div>;
};

export default SchemaJson;
