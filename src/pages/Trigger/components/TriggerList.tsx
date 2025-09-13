import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import PageContainer from '@/components/common/PageContainer';

const { Option } = Select;

interface Trigger {
  id: string;
  name: string;
  description?: string;
  type: 'cron' | 'event';
  status: 'active' | 'inactive';
  flowId: string;
  flowName: string;
  config: any;
  createdAt: string;
  updatedAt: string;
}

const TriggerList: React.FC = () => {
  const { t } = useTranslation();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    loadTriggers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTriggers = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const mockTriggers: Trigger[] = [
        {
          id: '1',
          name: '每日数据同步',
          description: '每天凌晨2点执行数据同步流程',
          type: 'cron',
          status: 'active',
          flowId: 'flow-1',
          flowName: '数据同步流程',
          config: { cron: '0 2 * * *' },
          createdAt: '2024-01-15 10:00:00',
          updatedAt: '2024-01-15 10:00:00'
        },
        {
          id: '2',
          name: '用户注册事件',
          description: '当有新用户注册时触发欢迎流程',
          type: 'event',
          status: 'active',
          flowId: 'flow-2',
          flowName: '用户欢迎流程',
          config: { event: 'user.registered' },
          createdAt: '2024-01-16 14:30:00',
          updatedAt: '2024-01-16 14:30:00'
        },
        {
          id: '3',
          name: '手动备份流程',
          description: '手动触发的数据备份流程',
          type: 'event',
          status: 'inactive',
          flowId: 'flow-3',
          flowName: '数据备份流程',
          config: {},
          createdAt: '2024-01-17 09:15:00',
          updatedAt: '2024-01-17 09:15:00'
        }
      ];
      setTriggers(mockTriggers);
    } catch {
      message.error(t('load_triggers_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTrigger(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    form.setFieldsValue(trigger);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // 模拟API调用
      setTriggers(triggers.filter(t => t.id !== id));
      message.success(t('delete_success'));
    } catch {
      message.error(t('delete_failed'));
    }
  };

  const handleToggleStatus = async (trigger: Trigger) => {
    try {
      // 模拟API调用
      const updatedTriggers = triggers.map(t =>
        t.id === trigger.id
          ? { ...t, status: t.status === 'active' ? 'inactive' as const : 'active' as const }
          : t
      );
      setTriggers(updatedTriggers);
      message.success(t('status_updated_success'));
    } catch {
      message.error(t('status_update_failed'));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTrigger) {
        // 更新触发器
        const updatedTriggers = triggers.map(t =>
          t.id === editingTrigger.id
            ? { ...t, ...values, updatedAt: new Date().toLocaleString() }
            : t
        );
        setTriggers(updatedTriggers);
        message.success(t('update_success'));
      } else {
        // 创建新触发器
        const newTrigger: Trigger = {
          id: Date.now().toString(),
          ...values,
          status: 'active',
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString()
        };
        setTriggers([...triggers, newTrigger]);
        message.success(t('create_success'));
      }
      setModalVisible(false);
      form.resetFields();
    } catch {
      message.error(editingTrigger ? t('update_failed') : t('create_failed'));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cron': return 'blue';
      case 'event': return 'green';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'cron': return t('trigger_type_cron');
      case 'event': return t('trigger_type_event');
      default: return type;
    }
  };

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {getTypeText(type)}
        </Tag>
      ),
    },
    {
      title: t('flow_name'),
      dataIndex: 'flowName',
      key: 'flowName',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? t('active') : t('inactive')}
        </Tag>
      ),
    },
    {
      title: t('created_at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: t('operations'),
      key: 'operations',
      render: (_: any, record: Trigger) => (
        <Space>
          <Tooltip title={record.status === 'active' ? t('pause') : t('start')}>
            <Button
              type="text"
              icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title={t('edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t('delete_confirm')}
            description={t('delete_trigger_confirm_desc', { name: record.name })}
            onConfirm={() => handleDelete(record.id)}
            okText={t('confirm')}
            cancelText={t('cancel')}
          >
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title={t('trigger')}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          {t('create_trigger')}
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={triggers}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            t('pagination_total_text', {
              start: range[0],
              end: range[1],
              total: total
            }),
        }}
      />

      <Modal
        title={editingTrigger ? t('edit_trigger') : t('create_trigger')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label={t('name')}
            rules={[{ required: true, message: t('input_valid_msg', { name: t('name') }) }]}
          >
            <Input placeholder={t('enter_trigger_name')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('description')}
          >
            <Input.TextArea
              placeholder={t('enter_trigger_description')}
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={t('type')}
            rules={[{ required: true, message: t('select_trigger_type') }]}
          >
            <Select placeholder={t('select_trigger_type')}>
              <Option value="cron">{t('trigger_type_cron')}</Option>
              <Option value="event">{t('trigger_type_event')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="flowId"
            label={t('flow')}
            rules={[{ required: true, message: t('select_flow') }]}
          >
            <Select placeholder={t('select_flow')}>
              <Option value="flow-1">数据同步流程</Option>
              <Option value="flow-2">用户欢迎流程</Option>
              <Option value="flow-3">数据备份流程</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label={t('status')}
            valuePropName="checked"
            getValueFromEvent={(checked) => checked ? 'active' : 'inactive'}
            getValueProps={(value) => ({ checked: value === 'active' })}
          >
            <Switch
              checkedChildren={t('active')}
              unCheckedChildren={t('inactive')}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTrigger ? t('update') : t('create')}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                {t('cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default TriggerList;
