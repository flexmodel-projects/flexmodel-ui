import React, {useEffect, useState} from 'react';
import {Checkbox, Col, Divider, Form, Input, InputNumber, Radio, Row, Select, TimePicker} from 'antd';
import {useTranslation} from 'react-i18next';
import {
  DAILY_TIME_INTERVAL_UNITS,
  DAYS_OF_WEEK,
  INTERVAL_UNITS,
  MUTATION_TYPES,
  TRIGGER_TIMINGS,
  TriggerFormType
} from '@/types/trigger';
import {TriggerDTO} from '@/services/trigger';
import {getDatasourceList} from '@/services/datasource';
import {getModelList} from '@/services/model';
import {FlowModule, getFlowList} from '@/services/flow';
import {DatasourceSchema} from '@/types/data-source';
import {EntitySchema, EnumSchema, NativeQuerySchema} from '@/types/data-modeling';

const {Option} = Select;

export interface TriggerFormProps {
  /** 表单模式：create | edit | view */
  mode: 'create' | 'edit' | 'view';
  /** 编辑时的触发器数据 */
  trigger?: TriggerDTO;
  /** 外部Form实例 */
  form?: any;
  /** 提交回调 */
  onSubmit?: (values: any) => void;
}

const TriggerForm: React.FC<TriggerFormProps> = ({
                                                   mode,
                                                   trigger,
                                                   form: externalForm,
                                                   onSubmit
                                                 }) => {
  const {t} = useTranslation();
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [triggerFormType, setTriggerFormType] = useState<TriggerFormType>('interval');
  const [datasources, setDatasources] = useState<DatasourceSchema[]>([]);
  const [models, setModels] = useState<(EntitySchema | EnumSchema | NativeQuerySchema)[]>([]);
  const [flows, setFlows] = useState<FlowModule[]>([]);
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

  // 获取流程列表
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const flowList = await getFlowList({size: 1000});
        setFlows(flowList.list);
      } catch (error) {
        console.error('获取流程列表失败:', error);
      }
    };
    fetchFlows();
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
      if (trigger.type === 'EVENT' && 'datasourceName' in trigger.config) {
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
          <Option value="SCHEDULED">{t('trigger.type_scheduled')}</Option>
          <Option value="EVENT">{t('trigger.type_event')}</Option>
        </Select>
      </Form.Item>

      {/* 当选择定时触发时，显示触发形式配置 */}
      <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
        {({getFieldValue}) => {
          const triggerType = getFieldValue('type');
          if (triggerType === 'SCHEDULED') {
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
          } else if (triggerType === 'EVENT') {
            return renderEventTriggerConfig(mode, t, datasources, models, selectedDatasource, handleDatasourceChange);
          }
          return null;
        }}
      </Form.Item>
      <Divider orientation="left">{t('trigger.job')}</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="jobType"
            label={t('trigger.job_type')}
            rules={[{required: true, message: t('trigger.select_job_type')}]}
            initialValue="FLOW"
          >
            <Select
              placeholder={t('trigger.select_job_type')}
              disabled={mode === 'view'}
            >
              <Option value="FLOW">{t('flow')}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="jobId"
            label={t('trigger.job_name')}
            rules={[{required: true, message: t('trigger.select_job_name')}]}
          >
            <Select
              placeholder={t('trigger.select_job_name')}
              disabled={mode === 'view'}
            >
              {flows.map(flow => (
                <Option key={flow.flowModuleId} value={flow.flowModuleId}>
                  {flow.flowName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

// 渲染触发形式配置
const renderTriggerFormConfig = (formType: TriggerFormType, mode: string, t: any) => {
  if (!formType) return null;

  switch (formType) {
    case 'interval':
      return (
        <>
          <Divider orientation="left">{t('trigger.interval_trigger')}</Divider>
          <Row gutter={16}>
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
            <Col span={8}>
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
            <Col span={8}>
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
          </Row>
        </>
      );

    case 'cron':
      return (
        <>
          <Divider orientation="left">{t('trigger.cron_trigger')}</Divider>
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
        </>
      );


    case 'daily_time_interval':
      return (
        <>
          <Divider orientation="left">{t('trigger.daily_time_interval_trigger')}</Divider>
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
              {/* 占位列，保持布局平衡 */}
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
        </>
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
    <>
      <Divider orientation="left">{t('trigger.event_config')}</Divider>
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
    </>
  );
};

export default TriggerForm;
