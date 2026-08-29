import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Space, Spin, Tabs, Tag, theme, Typography} from 'antd';
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
          renderItem: (params: any, api: any) => {
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
              <div style={{fontFamily: 'monospace', fontSize: 12}}>
                {detail.spans.map(s => (
                  <div key={s.id} style={{
                    padding: '4px 8px',
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                  }}>
                    <Space>
                      <Tag color={s.status === 'ERROR' ? 'red' : s.kind === 'SERVER' ? 'blue' : 'green'}>
                        {s.kind}
                      </Tag>
                      <span style={{fontWeight: 600}}>{s.name}</span>
                      <span style={{color: token.colorTextSecondary}}>{fmtDuration(s.durationNs)}</span>
                    </Space>
                  </div>
                ))}
              </div>
            ) : null,
          },
          {
            key: 'apiLogs',
            label: `${t('api_log')} (${detail?.apiLogs?.length ?? 0})`,
            children: detail?.apiLogs?.length ? (
              <div style={{fontFamily: 'monospace', fontSize: 12}}>
                {detail.apiLogs.map(l => (
                  <div key={l.id} style={{padding: '4px 8px', borderBottom: `1px solid ${token.colorBorderSecondary}`}}>
                    <Tag color={l.isSuccess ? 'green' : 'red'}>{l.statusCode}</Tag>
                    <span>{l.httpMethod} {l.path}</span>
                    <span style={{color: token.colorTextSecondary, marginLeft: 8}}>{l.responseTime}ms</span>
                  </div>
                ))}
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'functionLogs',
            label: `${t('function.logTitle', '函数日志')} (${detail?.functionLogs?.length ?? 0})`,
            children: detail?.functionLogs?.length ? (
              <div style={{
                maxHeight: 400, overflow: 'auto', background: token.colorFillSecondary,
                borderRadius: token.borderRadius, padding: 'var(--ant-padding-sm)',
                fontFamily: 'monospace', fontSize: 12,
              }}>
                {detail.functionLogs.map((l, i) => (
                  <div key={l.id || i} style={{
                    padding: '2px 0',
                    color: l.level === 'error' ? token.colorError : l.level === 'warn' ? token.colorWarning : token.colorText,
                  }}>
                    [{l.level.toUpperCase()}] [{l.functionName}] {l.message}
                  </div>
                ))}
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'jobExecutionLogs',
            label: `${t('observability.job_execution_log')} (${detail?.jobExecutionLogs?.length ?? 0})`,
            children: detail?.jobExecutionLogs?.length ? (
              <div style={{fontFamily: 'monospace', fontSize: 12}}>
                {detail.jobExecutionLogs.map(l => (
                  <div key={l.id} style={{padding: '4px 8px', borderBottom: `1px solid ${token.colorBorderSecondary}`}}>
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
                    {l.errorMessage && (
                      <div style={{color: token.colorError, marginTop: 2}}>{l.errorMessage}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'nodeInstanceLogs',
            label: `${t('observability.node_instance_logs')} (${detail?.nodeInstanceLogs?.length ?? 0})`,
            children: detail?.nodeInstanceLogs?.length ? (
              <div style={{fontFamily: 'monospace', fontSize: 12}}>
                {detail.nodeInstanceLogs.map(l => {
                  const statusInfo = nodeLogStatusInfo(l.status);
                  return (
                    <div key={l.id}
                         style={{padding: '4px 8px', borderBottom: `1px solid ${token.colorBorderSecondary}`}}>
                      <Space>
                        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                        <span style={{fontWeight: 600}}>{l.nodeKey}</span>
                        <span style={{color: token.colorTextSecondary}}>{nodeLogTypeLabel(l.type)}</span>
                        {l.createdAt && (
                          <span style={{color: token.colorTextTertiary}}>{l.createdAt}</span>
                        )}
                      </Space>
                    </div>
                  );
                })}
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
          {
            key: 'auditLogs',
            label: `${t('observability.audit_logs')} (${detail?.auditLogs?.length ?? 0})`,
            children: detail?.auditLogs?.length ? (
              <div style={{fontFamily: 'monospace', fontSize: 12}}>
                {detail.auditLogs.map(l => {
                  const color =
                    l.action === 'INSERTED' ? 'green' :
                      l.action === 'UPDATED' ? 'blue' :
                        l.action === 'DELETED' ? 'red' : 'default';
                  return (
                    <div key={l.id}
                         style={{padding: '4px 8px', borderBottom: `1px solid ${token.colorBorderSecondary}`}}>
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
                    </div>
                  );
                })}
              </div>
            ) : <Typography.Text type="secondary">-</Typography.Text>,
          },
        ]}
      />
    </PageContainer>
  );
};

export default TraceDetailPage;
