// 运行时可用的流程元素类型定义，与声明文件保持一致
export enum FlowElementType {
  SEQUENCE_FLOW = 1,
  START_EVENT = 2,
  END_EVENT = 3,
  USER_TASK = 4,
  SERVICE_TASK = 5,
  EXCLUSIVE_GATEWAY = 6,
  CALL_ACTIVITY = 8,
  PARALLEL_GATEWAY = 9,
  INCLUSIVE_GATEWAY = 10,
}

export type NodeType =
  | 'startEvent'
  | 'endEvent'
  | 'userTask'
  | 'serviceTask'
  | 'exclusiveGateway'
  | 'parallelGateway'
  | 'inclusiveGateway'
  | 'callActivity';


