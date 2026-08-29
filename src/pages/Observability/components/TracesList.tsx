import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Button, Input, Space, Table, Tag, theme} from 'antd';
import PageContainer from '@/components/common/PageContainer';
import {getTraces} from '@/services/observability';
import {useTranslation} from 'react-i18next';
import type {TraceListItem} from '@/types/observability';
import {useProject} from '@/store/appStore';
import {useNavigate} from 'react-router-dom';
import {SearchOutlined} from '@ant-design/icons';

const TracesList: React.FC = () => {
  const {token} = theme.useToken();
  const {t} = useTranslation();
  const {currentProject} = useProject();
  const navigate = useNavigate();
  const projectId = currentProject?.id || '';

  const [data, setData] = useState<{ list: TraceListItem[]; total: number }>({list: [], total: 0});
  const [data, setData] = useState<{ list: TraceListItem[]; total: number }>({list: [], total: 0});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [traceId, setTraceId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [searchTraceId, setSearchTraceId] = useState('');

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [tableScrollY, setTableScrollY] = useState<number>(300);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await getTraces(projectId, {traceId});
      setData({list: res.list, total: res.total});
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [projectId, traceId, setData]);

  const search = () => {
    setTraceId(searchTraceId || undefined);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTableHeight = useCallback(() => {
    const wrapper = tableContainerRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const table = wrapper.querySelector<HTMLElement>('.ant-table');
    if (!table) return;

    const tableRect = table.getBoundingClientRect();
    const tableAvailable = wrapperRect.bottom - tableRect.top;

    const header =
      wrapper.querySelector<HTMLElement>('.ant-table-header') ||
      wrapper.querySelector<HTMLElement>('.ant-table-thead');
    const headerHeight = header ? header.getBoundingClientRect().height : 39;

    const pagination = wrapper.querySelector<HTMLElement>('.ant-table-pagination');
    let paginationHeight = 0;
    if (pagination) {
      const pr = pagination.getBoundingClientRect();
      const cs = getComputedStyle(pagination);
      paginationHeight =
        pr.height + parseFloat(cs.marginTop || '0') + parseFloat(cs.marginBottom || '0');
    }

    const extraSpacing = 8;
    const available = tableAvailable - headerHeight - paginationHeight - extraSpacing;
    setTableScrollY(Math.max(available, 150));
  }, []);

  useLayoutEffect(() => {
    updateTableHeight();
    const ro = new ResizeObserver(updateTableHeight);
    if (tableContainerRef.current) {
      ro.observe(tableContainerRef.current);
    }
    window.addEventListener('resize', updateTableHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateTableHeight);
    };
  }, [updateTableHeight]);

  useEffect(() => {
    updateTableHeight();
  }, [data, loading, updateTableHeight]);

  const fmtDuration = (ns: number) => {
    if (ns == null) return '-';
    const ms = ns / 1_000_000;
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const fmtTime = (ns: number) => {
    if (!ns) return '-';
    return new Date(ns / 1_000_000).toLocaleString();
  };

  const columns = [
    {
      title: t('trace_id', 'Trace ID'),
      dataIndex: 'traceId',
      width: 140,
      ellipsis: true,
    },
    {
      title: t('trace.rootName', '根操作'),
      dataIndex: 'rootName',
      ellipsis: true,
    },
    {
      title: t('trace.startTime', '起始时间'),
      dataIndex: 'startTime',
      width: 180,
      render: (v: number) => fmtTime(v),
    },
    {
      title: t('trace.duration', '总耗时'),
      dataIndex: 'totalDurationNs',
      width: 100,
      render: (v: number) => fmtDuration(v),
    },
    {
      title: t('trace.spanCount', 'Span数'),
      dataIndex: 'spanCount',
      width: 80,
    },
    {
      title: t('trace.status', '状态'),
      dataIndex: 'hasError',
      width: 80,
      render: (hasError: boolean) => (
        <Tag color={hasError ? token.colorError : token.colorSuccess}>
          {hasError ? t('error') : t('ok', 'OK')}
        </Tag>
      ),
    },
  ];

  return (
    <PageContainer title={t('observability.traces')}
                   extra={<div style={{display: 'flex', justifyContent: 'flex-end', flexShrink: 0}}>
                     <Space>
                       <Input
                         placeholder={t('trace_id', 'Trace ID')}
                         value={searchTraceId}
                         onChange={(e) => setSearchTraceId(e.target.value)}
                         onPressEnter={search}
                         allowClear
                         style={{width: 320}}
                       />
                       <Button type="primary" icon={<SearchOutlined/>} onClick={search}>
                         {t('search', '搜索')}
                       </Button>
                     </Space>
                   </div>}
    >
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>

      <div
          ref={tableContainerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Table
            bordered={false}
            columns={columns}
            dataSource={data.list}
            rowKey="traceId"
            loading={loading}
            scroll={{y: tableScrollY}}
            style={{flex: 1, minHeight: 0}}
            rowClassName={() => 'cursor-pointer'}
            onRow={(record) => ({
              onClick: () => navigate(`/project/${projectId}/observability/traces/${record.traceId}`),
            })}
            pagination={{
              current: page,
              pageSize: size,
              total: data.total,
              showSizeChanger: true,
              showTotal: (total: number, range: [number, number]) =>
                t('pagination_total_text', {start: range[0], end: range[1], total}),
              onChange: (p: number, s: number) => {
                setPage(p);
                setSize(s);
              },
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default TracesList;
