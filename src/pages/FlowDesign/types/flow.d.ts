// 流程元素类型枚举
export enum FlowElementType {
  SEQUENCE_FLOW = 1,
  START_EVENT = 2,
  END_EVENT = 3,
  USER_TASK = 4,
  EXCLUSIVE_GATEWAY = 5,
  PARALLEL_GATEWAY = 6,
  INCLUSIVE_GATEWAY = 7,
  CALL_ACTIVITY = 8,
}

// 流程元素基础接口
export interface FlowElement {
  key: string;
  type: FlowElementType;
  incoming: string[];
  outgoing: string[];
  properties: Record<string, any>;
}

// 流程节点接口
export interface FlowNode extends FlowElement {
  name?: string;
}

// 开始事件节点
export interface StartEvent extends FlowNode {
  type: FlowElementType.START_EVENT;
}

// 结束事件节点
export interface EndEvent extends FlowNode {
  type: FlowElementType.END_EVENT;
}

// 用户任务节点
export interface UserTask extends FlowNode {
  type: FlowElementType.USER_TASK;
}

// 排他网关节点
export interface ExclusiveGateway extends FlowNode {
  type: FlowElementType.PARALLEL_GATEWAY; // 根据数据格式，并行网关是6
  properties: {
    name?: string;
    hookInfoIds?: string; // 用于刷新数据的key列表，格式如"[1,2]"
  };
}

// 并行网关节点
export interface ParallelGateway extends FlowNode {
  type: FlowElementType.PARALLEL_GATEWAY;
}

// 包容网关节点
export interface InclusiveGateway extends FlowNode {
  type: FlowElementType.INCLUSIVE_GATEWAY;
}

// 顺序流
export interface SequenceFlow extends FlowElement {
  type: FlowElementType.SEQUENCE_FLOW;
  properties: {
    name?: string;
    defaultConditions?: 'true' | 'false';
    conditionsequenceflow?: string; // 条件表达式
  };
}

// 调用子流程节点
export interface CallActivity extends FlowNode {
  type: FlowElementType.CALL_ACTIVITY;
  properties: {
    name?: string;
    callActivityExecuteType?: 'sync' | 'async';
    callActivityInstanceType?: 'single' | 'multiple';
    callActivityFlowModuleId?: string;
    callActivityCustomId?: string;
    callActivityInParamType?: 'none' | 'part' | 'full';
    callActivityInParam?: any;
    callActivityOutParamType?: 'none' | 'part' | 'full';
    callActivityOutParam?: any;
  };
}

// 流程模型
export interface FlowModel {
  flowElementList: FlowElement[];
}

// 节点类型定义
export type NodeType = 
  | 'startEvent'
  | 'endEvent'
  | 'userTask'
  | 'serviceTask'
  | 'exclusiveGateway'
  | 'parallelGateway'
  | 'inclusiveGateway'
  | 'callActivity';

// 节点面板项
export interface NodePanelItem {
  type: NodeType;
  label: string;
  icon: string;
  category: 'events' | 'gateways' | 'activities' | 'serviceTasks' | 'advanced';
}

// 流程状态
export type FlowStatus = 'enabled' | 'disabled';

// 消息通知方式
export interface NotificationMethods {
  inSiteMessage: boolean;
  emailNotification: boolean;
  dingTalkNotification: boolean;
}
