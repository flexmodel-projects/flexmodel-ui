import React, {useCallback, useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Pagination, Popconfirm, Space, Table, Tag, theme, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, PlayCircleOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';
import Editor from '@monaco-editor/react';
import {getDarkModeFromStorage} from '@/utils/darkMode';
import {
  createFlow,
  CreateFlowRequest,
  deleteFlow,
  FlowListParams,
  FlowModule,
  getFlowList,
  startProcess
} from '@/services/flow';
import dayjs from 'dayjs';
import {t} from 'i18next';

const FlowList: React.FC = () => {
  const navigate = useNavigate();
  const {token} = theme.useToken();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [flowList, setFlowList] = useState<FlowModule[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<FlowListParams>({
    page: 1,
    size: 20
  });

  // 创建流程相关状态
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

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

  // 启动流程实例
  const handleStartProcess = async (flowModuleId: string) => {
    let variablesText = '{}';
    const isDark = getDarkModeFromStorage();
    // 示例：{"orderId":123,"user":"tom"}
    Modal.confirm({
      width: 500,
      title: '启动流程实例',
      content: (
        <div>
          <div style={{ marginBottom: 8 }}>请输入流程变量（JSON）</div>
          <div style={{ border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 6 }}>
            <Editor
              height="240px"
              defaultLanguage="json"
              defaultValue={variablesText}
              theme={isDark ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                formatOnPaste: true,
                formatOnType: true,
              }}
              onChange={(value) => {
                variablesText = (value || '').toString();
              }}
            />
          </div>
        </div>
      ),
      okText: '启动',
      cancelText: '取消',
      onOk: async () => {
        let variables: Record<string, any> = {};
        const text = (variablesText || '').trim();
        if (text.length === 0) {
          variables = {};
        } else {
          try {
            variables = JSON.parse(text);
          } catch (e) {
            message.error('变量需为合法的 JSON');
            throw e as Error;
          }
        }
        await startProcess({ flowModuleId, variables });
        message.success('流程已启动');
      },
    });
  };

  // 创建流程
  const handleCreateFlow = async () => {
    try {
      const values = await form.validateFields();
      setCreateLoading(true);

      const createData: CreateFlowRequest = {
        flowKey: values.flowKey,
        flowName: values.flowName,
        remark: values.remark || '',
      };

      const response = await createFlow(createData);
      message.success('流程创建成功');
        setCreateModalVisible(false);
        form.resetFields();
        // 跳转到编辑页面
        navigate(`/flow/design/${response.flowModuleId}`);
        // 刷新列表
        fetchFlowList();
    } catch (error) {
      console.error('创建流程失败:', error);
      message.error('创建流程失败');
    } finally {
      setCreateLoading(false);
    }
  };

  // 删除流程
  const handleDeleteFlow = async (flowModuleId: string) => {
    try {
      await deleteFlow(flowModuleId);
      message.success('流程删除成功');
      // 刷新列表
      fetchFlowList();
    } catch (error) {
      console.error('删除流程失败:', error);
      message.error('删除流程失败');
    }
  };

  // 获取状态标签
  const getStatusTag = (status: number) => {
    const statusMap = {
      1: {text: '草稿', color: 'default'},
      2: {text: '设计', color: 'processing'},
      3: {text: '测试', color: 'warning'},
      4: {text: '已发布', color: 'success'}
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || {text: '未知', color: 'default'};
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
          <Tooltip title="启动流程实例">
            <Button
              type="link"
              icon={<PlayCircleOutlined/>}
              size="small"
              onClick={() => handleStartProcess(record.flowModuleId)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined/>}
              size="small"
              onClick={() => {
                navigate(`/flow/design/${record.flowModuleId}`);
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个流程吗？"
              description="删除后无法恢复，请谨慎操作"
              onConfirm={() => handleDeleteFlow(record.flowModuleId)}
              okText="确定删除"
              cancelText="取消"
              okType="danger"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined/>}
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
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        {/* 搜索和操作区域 */}
        <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Input
            placeholder="搜索流程名称"
            prefix={<SearchOutlined/>}
            style={{width: 200}}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                flowName: e.target.value || undefined,
                page: 1
              });
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined/>}
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            新建流程
          </Button>
        </div>
        <div style={{flex: 1, overflow: 'auto'}}>
          {/* 流程列表表格 */}
          <Table
            columns={columns}
            dataSource={flowList}
            rowKey="flowModuleId"
            loading={loading}
            pagination={false}
          />
        </div>

        {/* 分页区域 - 固定在底部 */}
        <div style={{
          padding: '16px 0',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          justifyContent: 'flex-end'
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

      {/* 创建流程Modal */}
      <Modal
        title="新建流程"
        open={createModalVisible}
        onOk={handleCreateFlow}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={createLoading}
        okText="创建"
        cancelText="取消"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="流程名称"
            name="flowName"
            rules={[
              { required: true, message: '请输入流程名称' },
              { max: 50, message: '流程名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入流程名称" />
          </Form.Item>

          <Form.Item
            label="流程键"
            name="flowKey"
            rules={[
              { required: true, message: '请输入流程键' },
              { max: 50, message: '流程键不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入流程键" />
          </Form.Item>

          <Form.Item
            label="备注"
            name="remark"
            rules={[
              { max: 200, message: '备注不能超过200个字符' }
            ]}
          >
            <Input.TextArea
              placeholder="请输入流程备注"
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default FlowList;
