import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography
} from 'antd';
import {DownOutlined, EyeOutlined, ReloadOutlined, SearchOutlined, UpOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import PageContainer from '@/components/common/PageContainer';
import {getJobExecutionLogs, JobExecutionLog, JobExecutionLogParams} from '@/services/job';
import dayjs from 'dayjs';
import {useProject} from "@/store/appStore";
import {useNavigate} from 'react-router-dom';

const {RangePicker} = DatePicker;
const {TextArea} = Input;
const {Text} = Typography;

const JobExecutionLogList: React.FC = () => {
  const {t} = useTranslation();
  const {currentProject} = useProject();
  const projectId = currentProject?.id || '';
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<JobExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLog, setSelectedLog] = useState<JobExecutionLog | null>(null);
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const [tableScrollY, setTableScrollY] = useState<number>(300);

  // 计算表格表体可用高度：用 table 顶部到 wrapper 底部的距离作为 table 的可用
  // 高度（flex:1 使 table 填满到 wrapper 底部），再减去表头、分页等占位。
  const updateTableHeight = useCallback(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const table = wrapper.querySelector<HTMLElement>('.ant-table');
    if (!table) {
      return;
    }

    const tableRect = table.getBoundingClientRect();
    // table 顶部到 wrapper 底部的高度（已自动包含上方搜索表单及其 margin）
    const tableAvailable = wrapperRect.bottom - tableRect.top;

    // 表头高度：滚动模式下为 .ant-table-header，否则取 .ant-table-thead
    const header =
      wrapper.querySelector<HTMLElement>('.ant-table-header') ||
      wrapper.querySelector<HTMLElement>('.ant-table-thead');
    const headerHeight = header ? header.getBoundingClientRect().height : 39;

    // 分页高度（含上下 margin，否则 .ant-table-pagination 的外边距会漏算导致表体过高、
    // 分页器被外层 overflow:hidden 裁掉底边）
    const pagination = wrapper.querySelector<HTMLElement>('.ant-table-pagination');
    let paginationHeight = 0;
    if (pagination) {
      const pr = pagination.getBoundingClientRect();
      const cs = getComputedStyle(pagination);
      paginationHeight =
        pr.height +
        parseFloat(cs.marginTop || '0') +
        parseFloat(cs.marginBottom || '0');
    }

    // 表格内部边距/边框等冗余间距
    const extraSpacing = 8;

    const available = tableAvailable - headerHeight - paginationHeight - extraSpacing;
    setTableScrollY(Math.max(available, 150));
  }, []);

  useLayoutEffect(() => {
    updateTableHeight();
    const ro = new ResizeObserver(updateTableHeight);
    if (tableWrapperRef.current) {
      ro.observe(tableWrapperRef.current);
    }
    window.addEventListener('resize', updateTableHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateTableHeight);
    };
  }, [updateTableHeight]);

  // 数据加载完成后、表头/分页高度可能变化，重新计算
  useEffect(() => {
    updateTableHeight();
  }, [logs, total, loading, updateTableHeight]);

  const loadLogs = async (params?: JobExecutionLogParams) => {
    setLoading(true);
    try {
      const queryParams = {
        page: currentPage,
        size: pageSize,
        ...params
      };

      const response = await getJobExecutionLogs(projectId, queryParams);
      setLogs(response.list);
      setTotal(response.total);
    } catch (error) {
      message.error('加载任务执行日志失败');
      console.error('Failed to load job execution logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (values: any) => {
    const params: JobExecutionLogParams = {};

    if (values.timeRange && values.timeRange.length === 2) {
      params.startTime = values.timeRange[0].format('YYYY-MM-DD HH:mm:ss');
      params.endTime = values.timeRange[1].format('YYYY-MM-DD HH:mm:ss');
    }

    if (values.isSuccess !== undefined) {
      params.isSuccess = values.isSuccess;
    }

    if (values.jobId) {
      params.jobId = values.jobId;
    }

    if (values.triggerId) {
      params.triggerId = values.triggerId;
    }

    if (values.status) {
      params.status = values.status;
    }

    setCurrentPage(1);
    loadLogs({
      ...params,
      page: 1,
      size: pageSize,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    loadLogs({page: 1, size: pageSize});
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  const handleViewDetail = (log: JobExecutionLog) => {
    setSelectedLog(log);
    setDetailModalVisible(true);
  };

  const getStatusTag = (executionStatus: string | undefined) => {
    if (executionStatus === 'SUCCESS') {
      return <Tag color="success">成功</Tag>;
    } else if (executionStatus === 'RUNNING') {
      return <Tag color="processing">运行中</Tag>;
    } else if (executionStatus === 'FAILED') {
      return <Tag color="error">失败</Tag>;
    } else {
      return <Tag color="default">未知</Tag>;
    }
  };

  const formatDuration = (duration: number | undefined) => {

    if (!duration) {
      return '-';
    }
    if (duration < 1000) {
      return `${duration}ms`;
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(2)}s`;
    } else {
      return `${(duration / 60000).toFixed(2)}min`;
    }
  };

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      width: 200,
    },
    {
      title: '任务ID',
      dataIndex: 'jobId',
      key: 'jobId',
      width: 120,
    },
    {
      title: '触发器ID',
      dataIndex: 'triggerId',
      key: 'triggerId',
      width: 120,
    },
    {
      title: '执行状态',
      key: 'executionStatus',
      width: 100,
      render: (_: any, record: JobExecutionLog) => getStatusTag(record.executionStatus),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('trace_id'),
      dataIndex: 'traceId',
      key: 'traceId',
      width: 140,
      ellipsis: true,
      render: (traceId: string) =>
        traceId ? (
          <a onClick={() => navigate(`/project/${projectId}/observability/traces/${traceId}`)}>
            {traceId.slice(0, 8)}…
          </a>
        ) : null,
    },
    {
      title: '执行时长',
      dataIndex: 'executionDuration',
      key: 'executionDuration',
      width: 100,
      render: (duration: number) => formatDuration(duration),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: JobExecutionLog) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined/>}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title={t('job_execution_log')}
      loading={loading}
      extra={
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{flexDirection: 'column', alignItems: 'flex-end'}}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Form.Item name="timeRange" label={t('date_range')} style={{marginBottom: 0}}>
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={[t('start_time'), t('end_time')]}
              />
            </Form.Item>
            <Form.Item name="isSuccess" label={t('execution_status')} style={{marginBottom: 0}}>
              <Select placeholder={t('select_status')} allowClear style={{width: 120}}>
                <Select.Option value={true}>{t('success')}</Select.Option>
                <Select.Option value={false}>{t('fail')}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item style={{marginBottom: 0}}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                  {t('search')}
                </Button>
                <Button onClick={handleReset}>
                  {t('reset')}
                </Button>
                <Button icon={<ReloadOutlined/>} onClick={() => loadLogs()}>
                  {t('refresh')}
                </Button>
                <Button type="link" onClick={() => setShowAdvanced(v => !v)}>
                  {t('more_filters')}
                  {showAdvanced ? <UpOutlined/> : <DownOutlined/>}
                </Button>
              </Space>
            </Form.Item>
          </div>
          {showAdvanced && (
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
              <Form.Item name="jobId" label={t('job_id')} style={{marginBottom: 0}}>
                <Input placeholder={t('input_job_id')} style={{width: 150}}/>
              </Form.Item>
              <Form.Item name="triggerId" label={t('trigger_id')} style={{marginBottom: 0}}>
                <Input placeholder={t('input_trigger_id')} style={{width: 150}}/>
              </Form.Item>
            </div>
          )}
        </Form>
      }
    >
      <div
        ref={tableWrapperRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
      <Table
        className="job-log-table"
        columns={columns}
        dataSource={logs}
        loading={loading}
        rowKey="id"
        size="small"
        scroll={{y: tableScrollY}}
        style={{flex: 1, minHeight: 0}}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            t("pagination_total_text", {
              start: range[0],
              end: range[1],
              total: total,
            }),
          onChange: handlePageChange,
          onShowSizeChange: (_current, size) => {
            setCurrentPage(1);
            setPageSize(size);
          }
        }}
      />
      </div>

      <Modal
        title="任务执行日志详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedLog && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="任务名称" span={2}>
              {selectedLog.jobName}
            </Descriptions.Item>
            <Descriptions.Item label="任务ID">
              {selectedLog.jobId}
            </Descriptions.Item>
            <Descriptions.Item label="任务组">
              {selectedLog.jobGroup}
            </Descriptions.Item>
            <Descriptions.Item label="任务类型">
              {selectedLog.jobType}
            </Descriptions.Item>
            <Descriptions.Item label="触发器ID">
              {selectedLog.triggerId}
            </Descriptions.Item>
            <Descriptions.Item label="执行状态">
              {getStatusTag(selectedLog.executionStatus)}
            </Descriptions.Item>
            <Descriptions.Item label="开始时间">
              {dayjs(selectedLog.startTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">
              {selectedLog.endTime ? dayjs(selectedLog.endTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="执行时长">
              {formatDuration(selectedLog.executionDuration)}
            </Descriptions.Item>
            <Descriptions.Item label="执行状态详情">
              {selectedLog.executionStatus}
            </Descriptions.Item>
            <Descriptions.Item label={t('trace_id')}>
              {selectedLog.traceId || '-'}
            </Descriptions.Item>
            {selectedLog.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <Text type="danger">{selectedLog.errorMessage}</Text>
              </Descriptions.Item>
            )}
            {selectedLog.inputData && (
              <Descriptions.Item label="输入数据" span={2}>
                <TextArea
                  value={JSON.stringify(selectedLog.inputData, null, 2)}
                  rows={4}
                  readOnly
                />
              </Descriptions.Item>
            )}
            {selectedLog.outputData && (
              <Descriptions.Item label="输出数据" span={2}>
                <TextArea
                  value={JSON.stringify(selectedLog.outputData, null, 2)}
                  rows={4}
                  readOnly
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default JobExecutionLogList;
