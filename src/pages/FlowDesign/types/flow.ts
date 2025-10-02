// 运行时可用的流程元素类型定义，与声明文件保持一致
export enum FlowElementType {
  SEQUENCE_FLOW = 1,
  START_EVENT = 2,
  END_EVENT = 3,
  USER_TASK = 4,
  EXCLUSIVE_GATEWAY = 5,
  PARALLEL_GATEWAY = 6,
  INCLUSIVE_GATEWAY = 7,
  CALL_ACTIVITY = 8,
  SERVICE_TASK = 9,
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


