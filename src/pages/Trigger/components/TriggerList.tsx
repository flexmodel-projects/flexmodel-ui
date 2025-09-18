import React, {useEffect, useState} from 'react';
import {Button, message, Modal, Pagination, Popconfirm, Space, Table, Tag, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import PageContainer from '@/components/common/PageContainer';
import TriggerForm from './TriggerForm';
import {Trigger} from '@/types/trigger';


const TriggerList: React.FC = () => {
  const {t} = useTranslation();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
          description: '每天凌晨2点执行数据同步动作',
          type: 'cron',
          status: 'active',
          flowId: 'flow-1',
          flowName: '数据同步动作',
          config: {
            triggerForm: 'cron',
            cronExpression: '0 2 * * *',
            timezone: 'Asia/Shanghai'
          },
          createdAt: '2024-01-15 10:00:00',
          updatedAt: '2024-01-15 10:00:00'
        },
        {
          id: '2',
          name: '用户注册事件',
          description: '当有新用户注册时触发欢迎动作',
          type: 'event',
          status: 'active',
          flowId: 'flow-2',
          flowName: '用户欢迎动作',
          config: {
            datasourceName: 'default',
            modelName: 'User',
            mutationTypes: ['create'],
            triggerTiming: 'after'
          },
          createdAt: '2024-01-16 14:30:00',
          updatedAt: '2024-01-16 14:30:00'
        },
        {
          id: '3',
          name: '手动备份动作',
          description: '手动触发的数据备份动作',
          type: 'event',
          status: 'inactive',
          flowId: 'flow-3',
          flowName: '数据备份动作',
          config: {
            datasourceName: 'default',
            modelName: 'Backup',
            mutationTypes: ['create'],
            triggerTiming: 'after'
          },
          createdAt: '2024-01-17 09:15:00',
          updatedAt: '2024-01-17 09:15:00'
        }
      ];
      setTriggers(mockTriggers);
    } catch {
      message.error(t('trigger.load_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTrigger(null);
    setModalVisible(true);
  };

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger);
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
          ? {...t, status: t.status === 'active' ? 'inactive' as const : 'active' as const}
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
            ? {...t, ...values, updatedAt: new Date().toLocaleString()}
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
    } catch {
      message.error(editingTrigger ? t('update_failed') : t('create_failed'));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cron':
        return 'blue';
      case 'event':
        return 'green';
      default:
        return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'cron':
        return t('trigger.type_cron');
      case 'event':
        return t('trigger.type_event');
      default:
        return type;
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
      title: t('trigger.flow_name'),
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
              icon={record.status === 'active' ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title={t('edit')}>
            <Button
              type="text"
              icon={<EditOutlined/>}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t('delete_confirm')}
            description={t('trigger.delete_confirm_desc', {name: record.name})}
            onConfirm={() => handleDelete(record.id)}
            okText={t('confirm')}
            cancelText={t('cancel')}
          >
            <Tooltip title={t('delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined/>}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 计算当前页显示的数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = triggers.slice(startIndex, endIndex);

  return (
    <PageContainer title={t('trigger.title')}
                   extra={
                     <Button
                       type="primary"
                       icon={<PlusOutlined/>}
                       onClick={handleCreate}
                     >
                       {t('trigger.create')}
                     </Button>
                   }
    >
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div style={{flex: 1, overflow: 'auto'}}>
          <Table
            columns={columns}
            dataSource={currentData}
            loading={loading}
            rowKey="id"
            pagination={false}
          />
        </div>
        <div style={{
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={triggers.length}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={(total, range) =>
              t('pagination_total_text', {
                start: range[0],
                end: range[1],
                total: total
              })
            }
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            }}
            onShowSizeChange={(_current: number, size: number) => {
              setCurrentPage(1);
              setPageSize(size);
            }}
          />
        </div>
      </div>

      <Modal
        title={editingTrigger ? t('trigger.edit') : t('trigger.create')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <TriggerForm
          mode={editingTrigger ? 'edit' : 'create'}
          trigger={editingTrigger || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </PageContainer>
  );
};

export default TriggerList;
