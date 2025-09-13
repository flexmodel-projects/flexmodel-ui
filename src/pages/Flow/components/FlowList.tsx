import React, {useCallback, useEffect, useState} from 'react';
import {Button, Input, message, Pagination, Popconfirm, Space, Table, Tag, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, PlayCircleOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import PageContainer from '@/components/common/PageContainer';
import {deployFlow, FlowListParams, FlowModule, getFlowList} from '@/services/flow';
import dayjs from 'dayjs';
import {t} from 'i18next';

const FlowList: React.FC = () => {

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [flowList, setFlowList] = useState<FlowModule[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<FlowListParams>({
    page: 1,
    size: 20
  });

  // 获取流程列表
  const fetchFlowList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFlowList(searchParams);
      setFlowList(response.list);
      setTotal(response.total);
    } catch (error) {
      console.error('获取流程列表失败:', error);
      message.error('获取流程列表失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFlowList();
  }, [fetchFlowList]);

  // 部署流程
  const handleDeployFlow = async (flowModuleId: string) => {
    try {
      await deployFlow(flowModuleId, { flowModuleId });
      message.success('流程部署成功');
      fetchFlowList();
    } catch (error) {
      console.error('部署流程失败:', error);
      message.error('部署流程失败');
    }
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    const statusMap = {
      1: { text: '草稿', color: 'default' },
      2: { text: '设计', color: 'processing' },
      3: { text: '测试', color: 'warning' },
      4: { text: '已发布', color: 'success' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { text: '未知', color: 'default' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '流程名称',
      dataIndex: 'flowName',
      key: 'flowName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '流程键',
      dataIndex: 'flowKey',
      key: 'flowKey',
      width: 150,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '修改者',
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: FlowModule) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                // TODO: 实现编辑功能
                message.info('编辑功能待实现');
              }}
            />
          </Tooltip>
          <Tooltip title="部署">
            <Button
              type="link"
              icon={<PlayCircleOutlined />}
              size="small"
              onClick={() => handleDeployFlow(record.flowModuleId)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个流程吗？"
              onConfirm={() => {
                // TODO: 实现删除功能
                message.info('删除功能待实现');
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 搜索和操作区域 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Input
            placeholder="搜索流程名称"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                flowName: e.target.value || undefined,
                page: 1
              });
            }}
          />
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            message.info('新增功能待实现');
          }}
        >
          新建流程
        </Button>
      </div>

      {/* 流程列表表格 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        minHeight: 400
      }}>
        <div style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          <Table
            columns={columns}
            dataSource={flowList}
            rowKey="flowModuleId"
            loading={loading}
            pagination={false}
            scroll={{ y: 'calc(100vh - 300px)', x: 1200 }}
          />
        </div>
        {/* 分页区域 - 固定在底部 */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1
        }}>
           <Pagination
             current={searchParams.page}
             pageSize={searchParams.size}
             total={total}
             showTotal={(total: number, range: any) =>
               t("pagination_total_text", {
                 start: range[0],
                 end: range[1],
                 total: total,
               })
             }
             onChange={(page: number, size: number) => {
               setSearchParams({
                 ...searchParams,
                 page,
                 size
               });
             }}
           />
        </div>
      </div>
    </PageContainer >
  );
};

export default FlowList;
