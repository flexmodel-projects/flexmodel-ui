import React, {useEffect, useState} from 'react';
import {
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {EyeOutlined, ReloadOutlined, SearchOutlined} from '@ant-design/icons';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import PageContainer from '@/components/common/PageContainer';
import {getAuditLogs, AuditLogParams} from '@/services/audit-log';
import type {AuditLog} from '@/types/observability';
import {useProject} from '@/store/appStore';
import {useNavigate} from 'react-router-dom';

const {TextArea} = Input;
const {Text} = Typography;

// 操作类型 -> 标签颜色
const actionTag = (action: string) => {
  switch (action) {
    case 'INSERTED':
      return <Tag color="green">{action}</Tag>;
    case 'UPDATED':
      return <Tag color="blue">{action}</Tag>;
    case 'DELETED':
      return <Tag color="red">{action}</Tag>;
    default:
      return <Tag color="default">{action}</Tag>;
  }
};

// 后端 oldData/newData 以 JSON 字符串存储，尝试美化输出
const prettyJson = (raw?: string) => {
  if (!raw) return '';
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
};

const AuditLogList: React.FC = () => {
  const {t} = useTranslation();
  const {currentProject} = useProject();
  const projectId = currentProject?.id || '';
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const loadLogs = async (params?: AuditLogParams) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await getAuditLogs(projectId, {
        page: currentPage,
        size: pageSize,
        ...params,
      });
      setLogs(res.list);
      setTotal(res.total);
    } catch (error) {
      message.error('加载审计日志失败');
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (values: any) => {
    const params: AuditLogParams = {};
    if (values.action) params.action = values.action;
    if (values.resourceType) params.resourceType = values.resourceType;
    if (values.userId) params.userId = values.userId;
    if (values.traceId) params.traceId = values.traceId;
    setCurrentPage(1);
    loadLogs({...params, page: 1, size: pageSize});
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    loadLogs({page: 1, size: pageSize});
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render: (action: string) => actionTag(action),
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      key: 'resourceType',
      width: 180,
      ellipsis: true,
    },
    {
      title: '资源名称',
      dataIndex: 'resourceName',
      key: 'resourceName',
      width: 180,
      ellipsis: true,
      render: (name?: string) => name || '-',
    },
    {
      title: '资源ID',
      dataIndex: 'resourceId',
      key: 'resourceId',
      width: 140,
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'userId',
      key: 'userId',
      width: 120,
      ellipsis: true,
      render: (userId?: string) => userId || '-',
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
    },
    {
      title: t('trace_id'),
      dataIndex: 'traceId',
      key: 'traceId',
      width: 140,
      ellipsis: true,
      render: (traceId?: string) =>
        traceId ? (
          <a onClick={() => navigate(`/project/${projectId}/observability/traces/${traceId}`)}>
            {traceId.slice(0, 8)}…
          </a>
        ) : null,
    },
    {
      title: '操作',
      key: 'action_col',
      width: 90,
      render: (_: any, record: AuditLog) => (
        <Button type="link" icon={<EyeOutlined/>} onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title={t('observability.audit_logs', '审计日志')}
      extra={
        <Form form={form} layout="inline" onFinish={handleSearch}
              style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Form.Item name="action" label="操作类型" style={{marginBottom: 0}}>
              <Select placeholder="选择操作类型" allowClear style={{width: 140}}>
                <Select.Option value="INSERTED">INSERTED</Select.Option>
                <Select.Option value="UPDATED">UPDATED</Select.Option>
                <Select.Option value="DELETED">DELETED</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="resourceType" label="资源类型" style={{marginBottom: 0}}>
              <Input placeholder="输入资源类型" allowClear style={{width: 180}}/>
            </Form.Item>
            <Form.Item style={{marginBottom: 0}}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                  搜索
                </Button>
                <Button onClick={handleReset}>重置</Button>
                <Button icon={<ReloadOutlined/>} onClick={() => loadLogs()}>刷新</Button>
                <Button type="link" onClick={() => setShowAdvanced(v => !v)}>
                  {t('more_filters', '更多筛选')}
                  {showAdvanced ? <UpOutlined/> : <DownOutlined/>}
                </Button>
              </Space>
            </Form.Item>
          </div>
          {showAdvanced && (
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
              <Form.Item name="userId" label="操作人" style={{marginBottom: 0}}>
                <Input placeholder="输入操作人ID" allowClear style={{width: 160}}/>
              </Form.Item>
              <Form.Item name="traceId" label={t('trace_id')} style={{marginBottom: 0}}>
                <Input placeholder="输入 Trace ID" allowClear style={{width: 180}}/>
              </Form.Item>
            </div>
          )}
        </Form>
      }
    >
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Table
          columns={columns}
          dataSource={logs}
          loading={loading}
          rowKey="id"
          size="small"
          scroll={{y: 500}}
          style={{flex: 1, minHeight: 0}}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              t('pagination_total_text', {start: range[0], end: range[1], total}),
            onChange: handlePageChange,
            onShowSizeChange: (_current, size) => {
              setCurrentPage(1);
              setPageSize(size);
            },
          }}
        />
      </div>

      <Modal
        title="审计日志详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            {t('close')}
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="操作类型" span={2}>
              {actionTag(selectedLog.action)}
            </Descriptions.Item>
            <Descriptions.Item label="资源类型">
              {selectedLog.resourceType}
            </Descriptions.Item>
            <Descriptions.Item label="资源名称">
              {selectedLog.resourceName || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="资源ID" span={2}>
              {selectedLog.resourceId}
            </Descriptions.Item>
            <Descriptions.Item label="操作人">
              {selectedLog.userId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="操作时间">
              {selectedLog.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label={t('trace_id')} span={2}>
              {selectedLog.traceId ? (
                <a onClick={() => navigate(`/project/${projectId}/observability/traces/${selectedLog.traceId}`)}>
                  {selectedLog.traceId}
                </a>
              ) : '-'}
            </Descriptions.Item>
            {selectedLog.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <Text type="danger">{selectedLog.errorMessage}</Text>
              </Descriptions.Item>
            )}
            {selectedLog.oldData && (
              <Descriptions.Item label="变更前数据" span={2}>
                <TextArea value={prettyJson(selectedLog.oldData)} rows={6} readOnly/>
              </Descriptions.Item>
            )}
            {selectedLog.newData && (
              <Descriptions.Item label="变更后数据" span={2}>
                <TextArea value={prettyJson(selectedLog.newData)} rows={6} readOnly/>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AuditLogList;
