import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  TimePicker
} from 'antd';
import {useTranslation} from 'react-i18next';
import {
  COMMON_TIMEZONES,
  DAILY_TIME_INTERVAL_UNITS,
  DAYS_OF_WEEK,
  INTERVAL_UNITS,
  MUTATION_TYPES,
  Trigger,
  TRIGGER_TIMINGS,
  TriggerFormType
} from '@/types/trigger';
import {getDatasourceList} from '@/services/datasource';
import {getModelList} from '@/services/model';
import {DatasourceSchema} from '@/types/data-source';
import {EntitySchema, EnumSchema, NativeQuerySchema} from '@/types/data-modeling';

const {Option} = Select;

export interface TriggerFormProps {
  /** 表单模式：create | edit | view */
  mode: 'create' | 'edit' | 'view';
  /** 编辑时的触发器数据 */
  trigger?: Trigger;
  /** 外部Form实例 */
  form?: any;
  /** 提交回调 */
  onSubmit?: (values: any) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

const TriggerForm: React.FC<TriggerFormProps> = ({
                                                   mode,
                                                   trigger,
                                                   form: externalForm,
                                                   onSubmit,
                                                   onCancel
                                                 }) => {
  const {t} = useTranslation();
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [triggerFormType, setTriggerFormType] = useState<TriggerFormType>('interval');
  const [datasources, setDatasources] = useState<DatasourceSchema[]>([]);
  const [models, setModels] = useState<(EntitySchema | EnumSchema | NativeQuerySchema)[]>([]);
  const [selectedDatasource, setSelectedDatasource] = useState<string>('');

  // 获取数据源列表
  useEffect(() => {
    const fetchDatasources = async () => {
      try {
        const dsList = await getDatasourceList();
        setDatasources(dsList);
      } catch (error) {
        console.error('获取数据源列表失败:', error);
      }
    };
    fetchDatasources();
  }, []);

  // 获取模型列表
  useEffect(() => {
    if (!selectedDatasource) {
      setModels([]);
      return;
    }

    const fetchModels = async () => {
      try {
        const modelList = await getModelList(selectedDatasource);
        console.log('获取到的模型列表:', modelList);
        // 过滤出type='entity'的模型
        const entityModels = modelList.filter(model => model.type === 'entity');
        console.log('过滤后的实体模型:', entityModels);
        setModels(entityModels);
      } catch (error) {
        console.error('获取模型列表失败:', error);
        setModels([]);
      }
    };
    fetchModels();
  }, [selectedDatasource]);

  // 初始化表单值
  useEffect(() => {
    if (trigger && (mode === 'edit' || mode === 'view')) {
      form.setFieldsValue(trigger);
      // 设置触发形式类型
      if (trigger.config?.triggerForm) {
        setTriggerFormType(trigger.config.triggerForm);
      }
      // 设置选中的数据源
      if (trigger.type === 'event' && 'datasourceName' in trigger.config) {
        setSelectedDatasource(trigger.config.datasourceName);
      }
    } else if (mode === 'create') {
      form.resetFields();
      setTriggerFormType('interval');
      setSelectedDatasource('');
    }
  }, [trigger, mode, form]);

  const handleSubmit = async (values: any) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const handleDatasourceChange = (value: string) => {
    setSelectedDatasource(value);
    // 清空模型选择
    form.setFieldValue(['config', 'modelName'], undefined);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label={t('name')}
        rules={[{required: true, message: t('input_valid_msg', {name: t('name')})}]}
      >
        <Input
          placeholder={t('trigger.enter_name')}
          disabled={mode === 'view'}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label={t('description')}
      >
        <Input.TextArea
          placeholder={t('trigger.enter_description')}
          rows={3}
          disabled={mode === 'view'}
        />
      </Form.Item>

      <Form.Item
        name="type"
        label={t('type')}
        rules={[{required: true, message: t('trigger.select_type')}]}
      >
        <Select
          placeholder={t('trigger.select_type')}
          disabled={mode === 'view'}
        >
          <Option value="cron">{t('trigger.type_cron')}</Option>
          <Option value="event">{t('trigger.type_event')}</Option>
        </Select>
      </Form.Item>

      {/* 当选择定时触发时，显示触发形式配置 */}
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
        {({getFieldValue}) => {
          const triggerType = getFieldValue('type');
          if (triggerType === 'cron') {
            return (
              <>
                <Form.Item
                  name="triggerForm"
                  label={t('trigger.form')}
                  rules={[{required: true, message: t('trigger.select_form')}]}
                >
                  <Select
                    placeholder={t('trigger.select_form')}
                    disabled={mode === 'view'}
                    onChange={setTriggerFormType}
                  >
                    <Option value="interval">{t('trigger.form_interval')}</Option>
                    <Option value="cron">{t('trigger.form_cron')}</Option>
                    <Option value="daily_time_interval">{t('trigger.form_daily_time_interval')}</Option>
                  </Select>
                </Form.Item>

                {/* 触发形式配置 */}
                <Form.Item noStyle
                           shouldUpdate={(prevValues, currentValues) => prevValues.triggerForm !== currentValues.triggerForm}>
                  {({getFieldValue}) => {
                    const formType = getFieldValue('triggerForm') || triggerFormType;
                    return renderTriggerFormConfig(formType, mode, t);
                  }}
                </Form.Item>
              </>
            );
          } else if (triggerType === 'event') {
            return renderEventTriggerConfig(mode, t, datasources, models, selectedDatasource, handleDatasourceChange);
          }
          return null;
        }}
      </Form.Item>

      <Form.Item
        name="flowId"
        label={t('flow')}
        rules={[{required: true, message: t('trigger.select_flow')}]}
      >
        <Select
          placeholder={t('trigger.select_flow')}
          disabled={mode === 'view'}
        >
          <Option value="flow-1">数据同步动作</Option>
          <Option value="flow-2">用户欢迎动作</Option>
          <Option value="flow-3">数据备份动作</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label={t('status')}
        valuePropName="checked"
        getValueFromEvent={(checked) => checked ? 'active' : 'inactive'}
        getValueProps={(value) => ({checked: value === 'active'})}
      >
        <Switch
          checkedChildren={t('active')}
          unCheckedChildren={t('inactive')}
          disabled={mode === 'view'}
        />
      </Form.Item>

      {mode !== 'view' && (
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {mode === 'edit' ? t('update') : t('create')}
            </Button>
            <Button onClick={onCancel}>
              {t('cancel')}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

// 渲染触发形式配置
const renderTriggerFormConfig = (formType: TriggerFormType, mode: string, t: any) => {
  if (!formType) return null;

  switch (formType) {
    case 'interval':
      return (
        <Card title={t('trigger.interval_trigger')} size="small">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name={['config', 'interval']}
                label={t('trigger.interval_value')}
                rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.interval_value')})}]}
              >
                <InputNumber
                  min={1}
                  placeholder={t('trigger.interval_value')}
                  disabled={mode === 'view'}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['config', 'intervalUnit']}
                label={t('trigger.interval_unit')}
                rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.interval_unit')})}]}
              >
                <Select
                  placeholder={t('trigger.interval_unit')}
                  disabled={mode === 'view'}
                >
                  {INTERVAL_UNITS.map(unit => (
                    <Option key={unit.value} value={unit.value}>
                      {t(unit.label)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['config', 'repeatCount']}
                label={t('trigger.repeat_count')}
                tooltip={t('trigger.repeat_forever')}
              >
                <InputNumber
                  min={1}
                  placeholder={t('trigger.repeat_count')}
                  disabled={mode === 'view'}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={['config', 'timezone']}
                label={t('trigger.timezone')}
              >
                <Select
                  placeholder={t('trigger.timezone_placeholder')}
                  disabled={mode === 'view'}
                  allowClear
                >
                  {COMMON_TIMEZONES.map(timezone => (
                    <Option key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      );

    case 'cron':
      return (
        <Card title={t('trigger.cron_trigger')} size="small">
          <Form.Item
            name={['config', 'cronExpression']}
            label={t('trigger.cron_expression')}
            rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.cron_expression')})}]}
            tooltip={t('trigger.cron_expression_help')}
          >
            <Input
              placeholder={t('trigger.cron_expression_placeholder')}
              disabled={mode === 'view'}
            />
          </Form.Item>
          <Form.Item
            name={['config', 'timezone']}
            label={t('trigger.timezone')}
          >
            <Select
              placeholder={t('trigger.timezone_placeholder')}
              disabled={mode === 'view'}
              allowClear
            >
              {COMMON_TIMEZONES.map(timezone => (
                <Option key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>
      );


    case 'daily_time_interval':
      return (
        <Card title={t('trigger.daily_time_interval_trigger')} size="small">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['config', 'startTime']}
                label={t('trigger.start_time')}
                rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.start_time')})}]}
              >
                <TimePicker
                  format="HH:mm:ss"
                  placeholder={t('trigger.start_time')}
                  disabled={mode === 'view'}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['config', 'endTime']}
                label={t('trigger.end_time')}
                rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.end_time')})}]}
              >
                <TimePicker
                  format="HH:mm:ss"
                  placeholder={t('trigger.end_time')}
                  disabled={mode === 'view'}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['config', 'interval']}
                label={t('trigger.interval_value')}
                rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.interval_value')})}]}
              >
                <InputNumber
                  min={1}
                  placeholder={t('trigger.interval_value')}
                  disabled={mode === 'view'}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['config', 'intervalUnit']}
                label={t('trigger.interval_unit')}
                rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.interval_unit')})}]}
              >
                <Select
                  placeholder={t('trigger.interval_unit')}
                  disabled={mode === 'view'}
                >
                  {DAILY_TIME_INTERVAL_UNITS.map(unit => (
                    <Option key={unit.value} value={unit.value}>
                      {t(unit.label)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['config', 'timezone']}
                label={t('trigger.timezone')}
              >
                <Select
                  placeholder={t('trigger.timezone_placeholder')}
                  disabled={mode === 'view'}
                  allowClear
                >
                  <Option value="Asia/Shanghai">Asia/Shanghai</Option>
                  <Option value="UTC">UTC</Option>
                  <Option value="America/New_York">America/New_York</Option>
                  <Option value="Europe/London">Europe/London</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name={['config', 'daysOfWeek']}
            label={t('trigger.days_of_week')}
            rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.days_of_week')})}]}
          >
            <Checkbox.Group disabled={mode === 'view'}>
              <Row>
                {DAYS_OF_WEEK.map(day => (
                  <Col key={day.value} span={8}>
                    <Checkbox value={day.value}>{t(day.label)}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Card>
      );

    default:
      return null;
  }
};

// 渲染事件触发配置
const renderEventTriggerConfig = (
  mode: string,
  t: any,
  datasources: DatasourceSchema[],
  models: (EntitySchema | EnumSchema | NativeQuerySchema)[],
  selectedDatasource: string,
  handleDatasourceChange: (value: string) => void
) => {
  return (
    <Card title={t('trigger.event_config')} size="small">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={['config', 'datasourceName']}
            label={t('datasource')}
            rules={[{required: true, message: t('input_valid_msg', {name: t('datasource')})}]}
          >
            <Select
              placeholder={t('select_datasource')}
              disabled={mode === 'view'}
              onChange={handleDatasourceChange}
            >
              {datasources.map(ds => (
                <Option key={ds.name} value={ds.name}>
                  {ds.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['config', 'modelName']}
            label={t('model')}
            rules={[{required: true, message: t('input_valid_msg', {name: t('model')})}]}
          >
            <Select
              placeholder={t('select_model')}
              disabled={mode === 'view' || !selectedDatasource}
            >
              {models.map(model => (
                <Option key={model.name} value={model.name}>
                  {model.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={['config', 'mutationTypes']}
            label={t('trigger.mutation_types')}
            rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.mutation_types')})}]}
          >
            <Checkbox.Group disabled={mode === 'view'}>
              <Row>
                {MUTATION_TYPES.map(mutation => (
                  <Col key={mutation.value} span={8}>
                    <Checkbox value={mutation.value}>{t(mutation.label)}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['config', 'triggerTiming']}
            label={t('trigger.timing')}
            rules={[{required: true, message: t('input_valid_msg', {name: t('trigger.timing')})}]}
            initialValue="after"
          >
            <Radio.Group disabled={mode === 'view'}>
              {TRIGGER_TIMINGS.map(timing => (
                <Radio key={timing.value} value={timing.value}>
                  {t(timing.label)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default TriggerForm;
