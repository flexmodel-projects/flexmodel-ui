import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Drawer, Form, Input, Select, Space, Table, theme} from 'antd';
import PageContainer from '@/components/common/PageContainer';
import {DownOutlined, SearchOutlined, UpOutlined} from '@ant-design/icons';
import {getFunctionLogs} from '@/services/function-log';
import {useTranslation} from 'react-i18next';
import type {FunctionLog} from '@/types/observability';
import {useProject} from '@/store/appStore';
import {useNavigate} from 'react-router-dom';

const {RangePicker} = DatePicker;

const FunctionLogList: React.FC = () => {
  const {token} = theme.useToken();
  const {t} = useTranslation();
  const {currentProject} = useProject();
  const navigate = useNavigate();
  const projectId = currentProject?.id || '';

  const [tableData, setTableData] = useState<{ list: FunctionLog[]; total: number }>({list: [], total: 0});
  const [log, setLog] = useState<FunctionLog | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [query, setQuery] = useState({page: 1, size: 50});
  const [form] = Form.useForm();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchData = async () => {
    if (!projectId) return;
    const filter = form.getFieldsValue();
    const dateRange = filter?.dateRange
      ?.map((d: any) => d?.format('YYYY-MM-DD HH:mm:ss'))
      ?.join(',');
    const res = await getFunctionLogs(projectId, {
      ...query,
      functionName: filter?.functionName,
      level: filter?.level,
      dateRange,
      traceId: filter?.traceId,
      keyword: filter?.keyword,
    });
    setTableData({list: res.list, total: res.total});
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  const search = () => {
    setQuery({page: 1, size: 50});
  };

  const levelColor = (level: string) => {
    if (level === 'error') return token.colorError;
    if (level === 'warn') return token.colorWarning;
    return token.colorText;
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      width: 100,
      ellipsis: true,
    },
    {
      title: t('function.name', '函数名'),
      dataIndex: 'functionName',
      width: 120,
      ellipsis: true,
    },
    {
      title: t('function.logLevel', '级别'),
      dataIndex: 'level',
      width: 70,
      render: (level: string) => (
        <span style={{color: levelColor(level), fontFamily: 'monospace'}}>
          {level.toUpperCase()}
        </span>
      ),
    },
    {
      title: t('function.logMessage', '消息'),
      dataIndex: 'message',
      ellipsis: true,
    },
    {
      title: t('trace_id', 'Trace ID'),
      dataIndex: 'traceId',
      width: 120,
      ellipsis: true,
      render: (traceId: string) =>
        traceId ? (
          <a onClick={() => navigate(`/project/${projectId}/observability/traces/${traceId}`)}>
            {traceId.slice(0, 8)}…
          </a>
        ) : null,
    },
    {
      title: t('created_at'),
      dataIndex: 'createdAt',
      width: 160,
    },
  ];

  return (
    <PageContainer
      title={t('function.logList', '函数日志列表')}
      extra={
        <Form form={form} layout="inline" style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Form.Item name="functionName" label={t('function.name', '函数名')} style={{marginBottom: 0}}>
              <Input allowClear style={{width: 160}}/>
            </Form.Item>
            <Form.Item name="level" label={t('function.logLevel', '级别')} style={{marginBottom: 0}}>
              <Select allowClear style={{width: 120}}>
                <Select.Option value="log">LOG</Select.Option>
                <Select.Option value="warn">WARN</Select.Option>
                <Select.Option value="error">ERROR</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" label={t('date_range')} style={{marginBottom: 0}}>
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
            </Form.Item>
            <Form.Item style={{marginBottom: 0}}>
              <Space>
                <Button type="primary" icon={<SearchOutlined/>} onClick={search}>
                  {t('search')}
                </Button>
                <Button type="link" onClick={() => setShowAdvanced(v => !v)}>
                  {t('more_filters', '更多筛选')}
                  {showAdvanced ? <UpOutlined/> : <DownOutlined/>}
                </Button>
              </Space>
            </Form.Item>
          </div>
          {showAdvanced && (
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
              <Form.Item name="traceId" label="Trace ID" style={{marginBottom: 0}}>
                <Input allowClear placeholder="traceId" style={{width: 180}}/>
              </Form.Item>
              <Form.Item name="keyword" label={t('search_keywords')} style={{marginBottom: 0}}>
                <Input allowClear placeholder={t('search_keywords')} style={{width: 180}}/>
              </Form.Item>
            </div>
          )}
        </Form>
      }
    >
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div style={{flex: 1, overflow: 'hidden'}}>
          <Table
            bordered={false}
            virtual
            scroll={{y: 500}}
            columns={columns}
            dataSource={tableData.list}
            rowKey="id"
            rowClassName={() => 'cursor-pointer'}
            onRow={(record) => ({
              onClick: () => {
                setLog(record);
                setDrawerVisible(true);
              },
            })}
            pagination={{
              current: query.page,
              pageSize: query.size,
              total: tableData.total,
              onChange: (page, size) => setQuery({page, size}),
            }}
          />
        </div>
      </div>

      <Drawer
        title={t('function.logDetail', '函数日志详情')}
        size={680}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {log && (
          <div style={{fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
            <p><strong>ID:</strong> {log.id}</p>
            <p><strong>Function:</strong> {log.functionName}</p>
            <p><strong>Level:</strong> <span style={{color: levelColor(log.level)}}>{log.level.toUpperCase()}</span></p>
            <p><strong>Trace ID:</strong> {log.traceId}</p>
            <p><strong>Time:</strong> {log.createdAt}</p>
            <p><strong>Message:</strong></p>
            <div style={{
              background: token.colorFillSecondary,
              padding: 'var(--ant-padding-sm)',
              borderRadius: token.borderRadius,
            }}>
              {log.message}
            </div>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default FunctionLogList;
