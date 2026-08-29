import React, {useEffect, useState} from 'react';
import {Button, Card, Collapse, Descriptions, Space, Spin, Tabs, Tag, theme, Typography} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import echarts from '@/utils/echarts';
import PageContainer from '@/components/common/PageContainer';
import {getTraceDetail} from '@/services/observability';
import {useTranslation} from 'react-i18next';
import type {Span, TraceDetail as TraceDetailType} from '@/types/observability';
import {useProject} from '@/store/appStore';
import {useNavigate, useParams} from 'react-router-dom';

const TraceDetailPage: React.FC = () => {
  const {token} = theme.useToken();
  const {t} = useTranslation();
  const {currentProject} = useProject();
  const projectId = currentProject?.id || '';
  const {traceId} = useParams<{ traceId: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<TraceDetailType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !traceId) return;
    setLoading(true);
    getTraceDetail(projectId, traceId)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [projectId, traceId]);

  const fmtDuration = (ns: number) => {
    if (!ns) return '-';
    const ms = ns / 1_000_000;
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const fmtMsTime = (ms: number) => {
    if (ms == null) return '-';
    return new Date(ms).toLocaleString();
  };

  const prettyJson = (raw: any) => {
    if (raw == null || raw === '') return '-';
    if (typeof raw === 'string') {
      try {
        return JSON.stringify(JSON.parse(raw), null, 2);
      } catch {
        return raw;
      }
    }
    try {
      return JSON.stringify(raw, null, 2);
    } catch {
      return String(raw);
    }
  };

  const JsonBlock: React.FC<{ data: any }> = ({data}) => (
    <pre style={{
      margin: 0, maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      background: token.colorFillSecondary, borderRadius: token.borderRadius,
      padding: 'var(--ant-padding-sm)', fontFamily: 'monospace', fontSize: 12,
    }}>
      {prettyJson(data)}
    </pre>
  );

  // 节点执行日志状态：1.处理成功 2.处理中 3.处理失败 4.处理已撤销
  const nodeLogStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return {text: t('trace.nodeStatus.success', '成功'), color: 'green'};
      case 2:
        return {text: t('trace.nodeStatus.running', '处理中'), color: 'blue'};
      case 3:
        return {text: t('trace.nodeStatus.failed', '失败'), color: 'red'};
      case 4:
        return {text: t('trace.nodeStatus.revoked', '已撤销'), color: 'default'};
      default:
        return {text: String(status ?? '-'), color: 'default'};
    }
  };

  // 节点执行日志操作类型：1.系统执行 2.任务提交 3.任务撤销
  const nodeLogTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return t('trace.nodeType.execute', '系统执行');
      case 2:
        return t('trace.nodeType.commit', '任务提交');
      case 3:
        return t('trace.nodeType.rollback', '任务撤销');
      default:
        return String(type ?? '-');
    }
  };

  const buildWaterfallOption = (spans: Span[]) => {
    if (!spans || spans.length === 0) return {};
    const minStart = Math.min(...spans.map(s => s.startTime));
    const sorted = [...spans].sort((a, b) => a.startTime - b.startTime);

    const categories = sorted.map(s => {
      const depth = computeDepth(s, spans);
      return '  '.repeat(depth) + s.name;
    });

    const data = sorted.map((s, i) => {
      const offset = (s.startTime - minStart) / 1_000_000;
      const duration = s.durationNs / 1_000_000;
      return {
        name: s.name,
        value: [i, offset, offset + duration, duration],
        itemStyle: {
          color: s.status === 'ERROR' ? token.colorError : s.kind === 'SERVER' ? token.colorPrimary : token.colorSuccess,
        },
      };
    });

    return {
      tooltip: {
        formatter: (p: any) => {
          const s = sorted[p.dataIndex];
          return `${s.name}<br/>耗时: ${fmtDuration(s.durationNs)}<br/>类型: ${s.kind}<br/>状态: ${s.status}`;
        },
      },
      grid: {left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true},
      xAxis: {
        type: 'value',
        name: 'ms',
        axisLabel: {formatter: (v: number) => `${v}ms`},
      },
      yAxis: {
        type: 'category',
        data: categories,
        inverse: true,
        axisLabel: {fontSize: 11},
      },
      series: [
        {
          type: 'custom',
          renderItem: (_params: any, api: any) => {
            const cat = api.value(0);
            const start = api.coord([api.value(1), cat]);
            const end = api.coord([api.value(2), cat]);
            const height = api.size([0, 1])[1] * 0.6;
            return {
              type: 'rect',
              shape: {x: start[0], y: start[1] - height / 2, width: end[0] - start[0], height},
              style: api.style(),
            };
          },
          encode: {x: [1, 2], y: 0},
          data,
        },
      ],
    };
  };

  const computeDepth = (span: Span, all: Span[]): number => {
    let depth = 0;
    let current = span;
    while (current.parentId) {
      const parent = all.find(s => s.spanId === current.parentId);
      if (!parent) break;
      depth++;
      current = parent;
      if (depth > 20) break;
    }
    return depth;
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{textAlign: 'center', padding: 48}}>
          <Spin tip={t('loading')} size="large">
            <div style={{minHeight: 200}}/>
          </Spin>
        </div>
      </PageContainer>
    );
  }

  const listScrollStyle: React.CSSProperties = {
    maxHeight: 'calc(100vh - 280px)',
    overflow: 'auto',
    paddingRight: 4,
  };

  return (
    <PageContainer>
      <div style={{marginBottom: 16}}>
        <Space>
          <Button icon={<ArrowLeftOutlined/>} onClick={() => navigate(`/project/${projectId}/observability/traces`)}>
            {t('back', '返回')}
          </Button>
          <Typography.Title level={5} style={{margin: 0}}>
            {t('trace.detail', '链路追踪详情')}
          </Typography.Title>
        </Space>
      </div>

      <Card size="small" style={{marginBottom: 16}}>
        <Descriptions column={4} size="small">
          <Descriptions.Item label="Trace ID">{traceId}</Descriptions.Item>
          <Descriptions.Item label={t('trace.spanCount', 'Span数')}>{detail?.spans?.length ?? 0}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs
        items={[
          {
            key: 'waterfall',
            label: t('trace.waterfall', '瀑布图'),
            children: detail?.spans?.length ? (
              <div style={{height: 500}}>
                <ReactECharts
                  echarts={echarts}
                  option={buildWaterfallOption(detail.spans)}
                  style={{height: '100%', width: '100%'}}
                />
              </div>
            ) : (
              <Typography.Text type="secondary">{t('trace.noSpans', '暂无 Span 数据')}</Typography.Text>
            ),
          },
          {
            key: 'spans',
            label: t('trace.spans', 'Span 列表'),
            children: detail?.spans?.length ? (
              <div style={listScrollStyle}>
                <Collapse
                  defaultActiveKey={[]}
                  ghost
                  size="small"
                  items={detail.spans.map(s => ({
                    key: s.id,
                    label: (
                    <Space>
                      <Tag color={s.status === 'ERROR' ? 'red' : s.kind === 'SERVER' ? 'blue' : 'green'}>
                        {s.kind}
                      </Tag>
                      <span style={{fontWeight: 600}}>{s.name}</span>
                      <span style={{color: token.colorTextSecondary}}>{fmtDuration(s.durationNs)}</span>
                    </Space>
                    ),
                    children: (
                      <Descriptions column={1} size="small" labelStyle={{width: 90}}>
                        <Descriptions.Item label="Span ID">{s.spanId}</Descriptions.Item>
                        <Descriptions.Item label={t('trace.parentId', '父 Span ID')}>
                          {s.parentId || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('trace.status', '状态')}>{s.status}</Descriptions.Item>
                        <Descriptions.Item label={t('trace.attributes', '属性')}>
                          {s.attributes || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('trace.startTime', '开始时间')}>{s.createdAt}</Descriptions.Item>
                      </Descriptions>
                    ),
                  }))}
                />
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'apiLogs',
            label: `${t('api_log')} (${detail?.apiLogs?.length ?? 0})`,
            children: detail?.apiLogs?.length ? (
              <div style={listScrollStyle}>
                <Collapse
                  defaultActiveKey={[]}
                  ghost
                  size="small"
                  items={detail.apiLogs.map(l => ({
                    key: l.id,
                    label: (
                      <Space>
                        <Tag color={l.isSuccess ? 'green' : 'red'}>{l.statusCode}</Tag>
                        <span>{l.path}</span>
                        <span style={{color: token.colorTextSecondary}}>{l.responseTime}ms</span>
                      </Space>
                    ),
                    children: (
                      <Descriptions column={1} size="small" labelStyle={{width: 100}}>
                        <Descriptions.Item label={t('path')}>{l.path}</Descriptions.Item>
                        {l.url && (
                          <Descriptions.Item label={t('url', 'URL')}>{l.url}</Descriptions.Item>
                        )}
                        <Descriptions.Item label={t('status_code')}>
                          <Tag color={l.isSuccess ? 'green' : 'red'}>{l.statusCode}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={t('response_time')}>{l.responseTime}ms</Descriptions.Item>
                        {l.clientIp && (
                          <Descriptions.Item label={t('client_ip')}>{l.clientIp}</Descriptions.Item>
                        )}
                        <Descriptions.Item label={t('is_success')}>
                          <Tag color={l.isSuccess ? 'green' : 'red'}>
                            {l.isSuccess ? t('success') : t('fail')}
                          </Tag>
                        </Descriptions.Item>
                        {l.errorMessage && (
                          <Descriptions.Item label={t('error_message')}>
                            <span style={{color: token.colorError}}>{l.errorMessage}</span>
                          </Descriptions.Item>
                        )}
                        {l.requestBody && (
                          <Descriptions.Item label={t('request_body')}>
                            <JsonBlock data={l.requestBody}/>
                          </Descriptions.Item>
                        )}
                        {l.requestHeaders && (
                          <Descriptions.Item label={t('request_headers')}>
                            <JsonBlock data={l.requestHeaders}/>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label={t('created_at')}>{l.createdAt}</Descriptions.Item>
                        <Descriptions.Item label="Trace ID">{l.traceId || '-'}</Descriptions.Item>
                      </Descriptions>
                    ),
                  }))}
                />
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'functionLogs',
            label: `${t('function.logTitle', '函数日志')} (${detail?.functionLogs?.length ?? 0})`,
            children: detail?.functionLogs?.length ? (
              <div style={listScrollStyle}>
                <Collapse
                  defaultActiveKey={[]}
                  ghost
                  size="small"
                  items={detail.functionLogs.map((l, i) => ({
                    key: l.id || String(i),
                    label: (
                      <Space>
                        <Tag
                          color={l.level === 'error' ? 'red' : l.level === 'warn' ? 'orange' : 'blue'}>
                          {l.level.toUpperCase()}
                        </Tag>
                        <span style={{fontWeight: 600}}>{l.functionName}</span>
                        <span style={{color: token.colorTextTertiary}}>{l.createdAt}</span>
                      </Space>
                    ),
                    children: (
                      <pre style={{
                        margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                        background: token.colorFillSecondary, borderRadius: token.borderRadius,
                        padding: 'var(--ant-padding-sm)', fontFamily: 'monospace', fontSize: 12,
                        color: l.level === 'error' ? token.colorError : l.level === 'warn' ? token.colorWarning : token.colorText,
                      }}>
                     {l.message}
                   </pre>
                    ),
                  }))}
                />
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'jobExecutionLogs',
            label: `${t('observability.job_execution_log')} (${detail?.jobExecutionLogs?.length ?? 0})`,
            children: detail?.jobExecutionLogs?.length ? (
              <div style={listScrollStyle}>
                <Collapse
                  defaultActiveKey={[]}
                  ghost
                  size="small"
                  items={detail.jobExecutionLogs.map(l => ({
                    key: l.id,
                    label: (
                    <Space>
                      <Tag
                        color={l.executionStatus === 'SUCCESS' ? 'green' : l.executionStatus === 'FAILED' ? 'red' : 'blue'}>
                        {l.executionStatus}
                      </Tag>
                      <span style={{fontWeight: 600}}>{l.jobName}</span>
                      <span style={{color: token.colorTextSecondary}}>{l.jobType}</span>
                      {l.executionDuration != null && (
                        <span style={{color: token.colorTextSecondary}}>{l.executionDuration}ms</span>
                      )}
                      <span style={{color: token.colorTextTertiary}}>{l.startTime}</span>
                    </Space>
                    ),
                    children: (
                      <Descriptions column={1} size="small" labelStyle={{width: 120}}>
                        <Descriptions.Item label={t('job_name')}>{l.jobName}</Descriptions.Item>
                        <Descriptions.Item label={t('job_id')}>{l.jobId}</Descriptions.Item>
                        {l.jobGroup && (
                          <Descriptions.Item label={t('job_group')}>{l.jobGroup}</Descriptions.Item>
                        )}
                        <Descriptions.Item label={t('job_type')}>{l.jobType}</Descriptions.Item>
                        <Descriptions.Item label={t('trigger_id')}>{l.triggerId}</Descriptions.Item>
                        <Descriptions.Item label={t('execution_status')}>
                          <Tag
                            color={l.executionStatus === 'SUCCESS' ? 'green' : l.executionStatus === 'FAILED' ? 'red' : 'blue'}>
                            {l.executionStatus}
                          </Tag>
                        </Descriptions.Item>
                        {l.executionDuration != null && (
                          <Descriptions.Item label={t('execution_duration')}>{l.executionDuration}ms</Descriptions.Item>
                        )}
                        <Descriptions.Item label={t('start_time')}>{l.startTime}</Descriptions.Item>
                        {l.endTime && (
                          <Descriptions.Item label={t('end_time')}>{l.endTime}</Descriptions.Item>
                        )}
                        {l.retryCount != null && (
                          <Descriptions.Item label={t('retry_count')}>{l.retryCount}</Descriptions.Item>
                        )}
                        {l.maxRetryCount != null && (
                          <Descriptions.Item label={t('max_retry_count')}>{l.maxRetryCount}</Descriptions.Item>
                        )}
                        {l.schedulerName && (
                          <Descriptions.Item label={t('scheduler_name')}>{l.schedulerName}</Descriptions.Item>
                        )}
                        {l.instanceName && (
                          <Descriptions.Item label={t('instance_name')}>{l.instanceName}</Descriptions.Item>
                        )}
                        {l.firedTime != null && (
                          <Descriptions.Item label={t('fired_time')}>{fmtMsTime(l.firedTime)}</Descriptions.Item>
                        )}
                        {l.scheduledTime != null && (
                          <Descriptions.Item
                            label={t('scheduled_time')}>{fmtMsTime(l.scheduledTime)}</Descriptions.Item>
                        )}
                        {l.errorMessage && (
                          <Descriptions.Item label={t('error_message')}>
                            <span style={{color: token.colorError}}>{l.errorMessage}</span>
                          </Descriptions.Item>
                        )}
                        {l.errorStackTrace && (
                          <Descriptions.Item label={t('error_stack_trace')}>
                            <pre style={{
                              margin: 0,
                              maxHeight: 200,
                              overflow: 'auto',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-all',
                              background: token.colorFillSecondary,
                              borderRadius: token.borderRadius,
                              padding: 'var(--ant-padding-sm)',
                              fontFamily: 'monospace',
                              fontSize: 12,
                              color: token.colorError,
                            }}>
                              {l.errorStackTrace}
                            </pre>
                          </Descriptions.Item>
                        )}
                        {l.inputData && (
                          <Descriptions.Item label={t('input_data')}>
                            <JsonBlock data={l.inputData}/>
                          </Descriptions.Item>
                        )}
                        {l.outputData && (
                          <Descriptions.Item label={t('output_data')}>
                            <JsonBlock data={l.outputData}/>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Trace ID">{l.traceId || '-'}</Descriptions.Item>
                        {l.createdAt && (
                          <Descriptions.Item label={t('created_at')}>{l.createdAt}</Descriptions.Item>
                        )}
                      </Descriptions>
                    ),
                  }))}
                />
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'nodeInstanceLogs',
            label: `${t('observability.node_instance_logs')} (${detail?.nodeInstanceLogs?.length ?? 0})`,
            children: detail?.nodeInstanceLogs?.length ? (
              <div style={listScrollStyle}>
                <Collapse
                  defaultActiveKey={[]}
                  ghost
                  size="small"
                  items={detail.nodeInstanceLogs.map(l => {
                  const statusInfo = nodeLogStatusInfo(l.status);
                    return {
                      key: String(l.id),
                      label: (
                      <Space>
                        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                        <span style={{fontWeight: 600}}>{l.nodeKey}</span>
                        <span style={{color: token.colorTextSecondary}}>{nodeLogTypeLabel(l.type)}</span>
                        {l.createdAt && (
                          <span style={{color: token.colorTextTertiary}}>{l.createdAt}</span>
                        )}
                      </Space>
                      ),
                      children: (
                        <Descriptions column={1} size="small" labelStyle={{width: 110}}>
                          <Descriptions.Item label={t('trace.nodeInstanceId', '节点实例 ID')}>
                            {l.nodeInstanceId}
                          </Descriptions.Item>
                          <Descriptions.Item label={t('trace.flowInstanceId', '流程实例 ID')}>
                            {l.flowInstanceId}
                          </Descriptions.Item>
                          {l.instanceDataId && (
                            <Descriptions.Item label={t('trace.instanceDataId', '数据实例 ID')}>
                              {l.instanceDataId}
                            </Descriptions.Item>
                          )}
                          <Descriptions.Item label="Trace ID">{l.traceId || '-'}</Descriptions.Item>
                        </Descriptions>
                      ),
                    };
                })}
                />
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'auditLogs',
            label: `${t('observability.audit_logs')} (${detail?.auditLogs?.length ?? 0})`,
            children: detail?.auditLogs?.length ? (
              <div style={listScrollStyle}>
                <Collapse
                  defaultActiveKey={[]}
                  ghost
                  size="small"
                  items={detail.auditLogs.map(l => {
                  const color =
                    l.action === 'INSERTED' ? 'green' :
                      l.action === 'UPDATED' ? 'blue' :
                        l.action === 'DELETED' ? 'red' : 'default';
                    return {
                      key: l.id,
                      label: (
                      <Space>
                        <Tag color={color}>{l.action}</Tag>
                        <span style={{fontWeight: 600}}>{l.resourceName || l.resourceId}</span>
                        <span style={{color: token.colorTextSecondary}}>{l.resourceType}</span>
                        {l.userId && (
                          <span style={{color: token.colorTextSecondary}}>{l.userId}</span>
                        )}
                        {l.createdAt && (
                          <span style={{color: token.colorTextTertiary}}>{l.createdAt}</span>
                        )}
                      </Space>
                      ),
                      children: (
                        <Descriptions column={1} size="small" labelStyle={{width: 90}}>
                          <Descriptions.Item label="Resource ID">{l.resourceId}</Descriptions.Item>
                          <Descriptions.Item label={t('trace.success', '结果')}>
                            <Tag color={l.success ? 'green' : 'red'}>
                              {l.success ? t('trace.successLabel', '成功') : t('trace.failedLabel', '失败')}
                            </Tag>
                          </Descriptions.Item>
                          {l.errorMessage && (
                            <Descriptions.Item label={t('trace.errorMessage', '错误信息')}>
                              <span style={{color: token.colorError}}>{l.errorMessage}</span>
                            </Descriptions.Item>
                          )}
                          <Descriptions.Item label="Trace ID">{l.traceId || '-'}</Descriptions.Item>
                        </Descriptions>
                      ),
                    };
                })}
                />
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
        ]}
      />
    </PageContainer>
  );
};

export default TraceDetailPage;
