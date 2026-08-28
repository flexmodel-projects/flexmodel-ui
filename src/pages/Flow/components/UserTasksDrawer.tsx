import React, {useState} from 'react';
import {Button, Drawer, message, Modal, Space, Spin, Steps, Tag, theme} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  RollbackOutlined,
  SendOutlined
} from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import {getDarkModeFromStorage} from '@/utils/darkMode';
import dayjs from 'dayjs';
import {
  commitTask,
  CommitTaskRequest,
  FlowInstance,
  FlowInstanceStatus,
  getInstanceData,
  isSuccess,
  NodeInstance,
  NodeInstanceStatus,
  rollbackTask,
  RollbackTaskRequest
} from '@/services/flow';

interface FlowInstanceHistoryDrawerProps {
  visible: boolean;
  loading: boolean;
  currentFlowInstance: FlowInstance | null;
  userTasks: NodeInstance[];
  projectId: string;
  onClose: () => void;
  onCommitted?: () => void;
}

const UserTasksDrawer: React.FC<FlowInstanceHistoryDrawerProps> = ({
                                                                     visible,
                                                                     loading,
                                                                     currentFlowInstance,
                                                                     userTasks,
                                                                     projectId,
                                                                     onClose,
                                                                     onCommitted,
                                                                   }) => {
  const {token} = theme.useToken();
  const [commitLoading, setCommitLoading] = useState(false);
  const [rollbackLoading, setRollbackLoading] = useState(false);
  const [instanceDataModalVisible, setInstanceDataModalVisible] = useState(false);
  const [instanceDataLoading, setInstanceDataLoading] = useState(false);
  const [instanceDataText, setInstanceDataText] = useState('{}');

  // 获取任务状态标签
  const getTaskStatusTag = (status: number) => {
    const taskStatusMap = {
      [NodeInstanceStatus.DEFAULT]: {text: '未处理', color: token.colorTextSecondary},
      [NodeInstanceStatus.COMPLETED]: {text: '已完成', color: token.colorSuccess},
      [NodeInstanceStatus.ACTIVE]: {text: '处理中', color: token.colorInfo},
      [NodeInstanceStatus.FAILED]: {text: '失败', color: token.colorError},
      [NodeInstanceStatus.DISABLED]: {text: '撤销', color: token.colorTextTertiary},
    };
    const statusInfo = taskStatusMap[status as keyof typeof taskStatusMap] || {
      text: '未知',
      color: token.colorTextSecondary
    };
    return <Tag color={statusInfo.color as any}>{statusInfo.text}</Tag>;
  };

  // 获取步骤状态和图标
  const getStepStatusAndIcon = (status: number) => {
    switch (status) {
      case NodeInstanceStatus.COMPLETED:
        return {
          status: 'finish' as const,
          icon: <CheckCircleOutlined style={{color: token.colorSuccess}}/>
        };
      case NodeInstanceStatus.FAILED:
        return {
          status: 'error' as const,
          icon: <CloseCircleOutlined style={{color: token.colorError}}/>
        };
      case NodeInstanceStatus.DISABLED:
        return {
          status: 'error' as const,
          icon: <MinusCircleOutlined style={{color: token.colorWarning}}/>
        };
      case NodeInstanceStatus.ACTIVE:
        return {
          status: 'process' as const,
          icon: <ClockCircleOutlined style={{color: token.colorWarning}}/>
        };
      default:
        return {
          status: 'wait' as const,
          icon: <PlayCircleOutlined style={{color: token.colorTextSecondary}}/>
        };
    }
  };

  // 获取流程实例状态标签
  const getFlowInstanceStatusTag = (status: number) => {
    const flowStatusMap = {
      0: {text: '初始化', color: 'error'},
      1: {text: '已完成', color: 'success'},
      2: {text: '运行中', color: 'processing'},
      3: {text: '已终止', color: 'warning'},
      4: {text: '已结束', color: 'primary'}
    };
    const statusInfo = flowStatusMap[status as keyof typeof flowStatusMap] || {text: '未知', color: 'default'};
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // 获取流程实例状态步骤配置
  const getEndStep = () => {
    if (!currentFlowInstance) return null;
    if (currentFlowInstance.status === 2) return null;

    const statusInfo = getFlowInstanceStatusTag(currentFlowInstance.status);

    return {
      title: (
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <span>结束</span>
          {statusInfo}
        </div>
      ),
      description: (
        <div style={{marginTop: 8}}>
          <div style={{marginBottom: 4}}>
            <strong>完成时间:</strong> {dayjs(currentFlowInstance.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      ),
      status: currentFlowInstance.status === 1 ? 'finish' as const :
        currentFlowInstance.status === 2 ? 'error' as const :
          currentFlowInstance.status === 3 ? 'error' as const : 'process' as const,
      icon: currentFlowInstance.status === 1 ? <CheckCircleOutlined style={{color: token.colorSuccess}}/> :
        currentFlowInstance.status === 2 ? <CloseCircleOutlined style={{color: token.colorError}}/> :
          currentFlowInstance.status === 3 ? <MinusCircleOutlined style={{color: token.colorWarning}}/> :
            <ClockCircleOutlined style={{color: token.colorWarning}}/>
    };
  };

  // 查看元素实例数据
  const handleViewInstanceData = async (task: NodeInstance) => {
    if (!currentFlowInstance) {
      message.warning('流程实例信息缺失');
      return;
    }
    if (!task.instanceDataId) {
      message.warning('当前任务无实例数据ID');
      return;
    }
    setInstanceDataModalVisible(true);
    setInstanceDataLoading(true);
    try {
      const {errCode, errMsg, variables} = await getInstanceData(
        projectId,
        currentFlowInstance.flowInstanceId,
        task.instanceDataId
      );
      if (!isSuccess(errCode)) {
        message.warning(errMsg);
        setInstanceDataText('{}');
        return;
      }
      setInstanceDataText(JSON.stringify(variables ?? {}, null, 2));
    } catch (e) {
      console.error('获取元素实例数据失败:', e);
      message.error('获取元素实例数据失败');
      setInstanceDataText('{}');
    } finally {
      setInstanceDataLoading(false);
    }
  };

  // 提交任务
  const handleCommitTask = async (task: NodeInstance) => {
    let variablesText = '{}';
    const isDark = getDarkModeFromStorage();

    Modal.confirm({
      width: 500,
      title: '提交任务',
      content: (
        <div>
          <div style={{marginBottom: 8}}>请输入任务变量（JSON）</div>
          <div style={{border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 6}}>
            <Editor
              height="240px"
              defaultLanguage="json"
              defaultValue={variablesText}
              theme={isDark ? 'vs-dark' : 'light'}
              options={{
                minimap: {enabled: false},
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
      okText: '提交',
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

        if (!currentFlowInstance) {
          message.error('流程实例信息缺失');
          return;
        }

        setCommitLoading(true);
        try {
          const commitData: CommitTaskRequest = {
            flowInstanceId: currentFlowInstance.flowInstanceId,
            taskInstanceId: task.nodeInstanceId,
            variables: variables,
          };

          const {errCode, errMsg} = await commitTask(projectId, currentFlowInstance.flowInstanceId, commitData);
          if (!isSuccess(errCode)) {
            message.warning(errMsg);
            return;
          }
          message.success('任务提交成功');
          // 刷新外部数据：user-tasks 与 实例列表
          if (onCommitted) {
            onCommitted();
          }

        } catch (error) {
          console.error('提交任务失败:', error);
          message.error('提交任务失败');
        } finally {
          setCommitLoading(false);
        }
      },
    });
  };

  // 退回任务
  const handleRollbackTask = async (task: NodeInstance) => {
    if (!currentFlowInstance) {
      message.error('流程实例信息缺失');
      return;
    }

    Modal.confirm({
      width: 380,
      title: '退回任务',
      content: (
        <div style={{marginTop: 8}}>
          将从「{task.name || task.key}」开始退回，退回到上一个用户任务节点（若已是第一个用户任务则退回失败）
        </div>
      ),
      okText: '退回',
      cancelText: '取消',
      onOk: async () => {
        setRollbackLoading(true);
        try {
          const data: RollbackTaskRequest = {
            flowInstanceId: currentFlowInstance.flowInstanceId,
            taskInstanceId: task.nodeInstanceId,
          };
          const {errCode, errMsg} = await rollbackTask(projectId, currentFlowInstance.flowInstanceId, data);
          if (!isSuccess(errCode)) {
            message.warning(errMsg);
            return;
          }
          message.success('任务已退回');
          if (onCommitted) onCommitted();
        } catch (e) {
          console.error('退回任务失败:', e);
          message.error('退回任务失败');
        } finally {
          setRollbackLoading(false);
        }
      }
    });
  };

  // 渲染操作按钮
  const renderActionButtons = (task: NodeInstance) => {
    const canCommit = currentFlowInstance?.status == FlowInstanceStatus.RUNNING && task.status === NodeInstanceStatus.ACTIVE;
    if (!canCommit && !task.instanceDataId) {
      return null;
    }
    return (
      <Space size={8}>
        {canCommit && (
          <Button
            type="primary"
            size="small"
            icon={<SendOutlined/>}
            loading={commitLoading}
            onClick={() => handleCommitTask(task)}
          >
            提交
          </Button>
        )}
        {canCommit && (
          <Button
            size="small"
            icon={<RollbackOutlined/>}
            loading={rollbackLoading}
            onClick={() => handleRollbackTask(task)}
          >
            退回
          </Button>
        )}
        <Button
          size="small"
          icon={<EyeOutlined/>}
          disabled={!task.instanceDataId}
          onClick={() => handleViewInstanceData(task)}
        >
          实例数据
        </Button>
      </Space>
    );
  };

  return (
    <>
    <Drawer
      title={
        <div>
          <HistoryOutlined style={{marginRight: 8}}/>
          用户任务列表
          {currentFlowInstance && (
            <div style={{fontSize: 14, fontWeight: 'normal', color: token.colorTextSecondary, marginTop: 4}}>
              {currentFlowInstance.flowName} ({currentFlowInstance.flowInstanceId})
            </div>
          )}
        </div>
      }
      size={600}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" onClick={onClose}>
          关闭
        </Button>
      }
    >
      {loading ? (
        <div style={{textAlign: 'center', padding: '40px 0'}}>
          <div>加载中...</div>
        </div>
      ) : (
        <Steps
          orientation="vertical"
          size="small"
          items={[
            // 结束节点（置顶，流程非运行中时展示）
            ...(currentFlowInstance ? [getEndStep()!] : []),
            // 用户任务步骤（后端返回倒序：最新在前）
            ...userTasks.map((task) => {
              const {status: stepStatus, icon} = getStepStatusAndIcon(task.status);

              return {
                title: (
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <span>{task.name || task.key}</span>
                      {getTaskStatusTag(task.status)}
                    </div>
                    {renderActionButtons(task)}
                  </div>
                ),
                description: (
                  <div style={{marginTop: 8}}>
                    <div style={{marginBottom: 4}}>
                      <strong>任务ID:</strong> {task.nodeInstanceId}
                    </div>
                    <div style={{marginBottom: 4}}>
                      <strong>节点键:</strong> {task.key}
                    </div>
                    {task.name && (
                      <div style={{marginBottom: 4}}>
                        <strong>节点名称:</strong> {task.name}
                      </div>
                    )}
                    <div style={{marginBottom: 4}}>
                      <strong>创建时间:</strong> {dayjs(task.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </div>
                ),
                status: stepStatus,
                icon: icon
              };
            }),
            // 开始节点（置底，最早的事件）
            {
              title: (
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <span>开始</span>
                  <Tag color="success">已完成</Tag>
                </div>
              ),
              description: (
                <div style={{marginTop: 8}}>
                  <div style={{marginBottom: 4}}>
                    <strong>创建时间:</strong> {currentFlowInstance ? dayjs(currentFlowInstance.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
                  </div>
                </div>
              ),
              status: 'finish' as const,
              icon: <CheckCircleOutlined style={{color: token.colorSuccess}}/>
            },
          ].filter((item): item is NonNullable<typeof item> => item !== null)}
        />
      )}
    </Drawer>
      <Modal
        title="元素实例数据"
        open={instanceDataModalVisible}
        width={600}
        onCancel={() => setInstanceDataModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setInstanceDataModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <Spin spinning={instanceDataLoading}>
          <div style={{border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 6}}>
            <Editor
              height="320px"
              defaultLanguage="json"
              value={instanceDataText}
              theme={getDarkModeFromStorage() ? 'vs-dark' : 'light'}
              options={{
                readOnly: true,
                minimap: {enabled: false},
                wordWrap: 'on',
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default UserTasksDrawer;
