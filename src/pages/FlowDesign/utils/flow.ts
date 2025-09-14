import {FlowElementType} from '../types/flow.d';

// 生成唯一ID
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${randomStr}`;
}

// 节点类型映射
export const NODE_TYPE_MAP: Record<string, FlowElementType> = {
  startEvent: FlowElementType.START_EVENT, // 2
  endEvent: FlowElementType.END_EVENT, // 3
  userTask: FlowElementType.USER_TASK, // 4
  exclusiveGateway: FlowElementType.PARALLEL_GATEWAY, // 6 (根据数据格式)
  parallelGateway: FlowElementType.PARALLEL_GATEWAY, // 6
  inclusiveGateway: FlowElementType.INCLUSIVE_GATEWAY, // 7
  callActivity: FlowElementType.CALL_ACTIVITY, // 8
};

// 根据FlowElementType获取节点类型
export function getNodeTypeByFlowElementType(type: FlowElementType): string {
  const entry = Object.entries(NODE_TYPE_MAP).find(([, value]) => value === type);
  return entry ? entry[0] : 'userTask';
}

// 验证条件表达式
export function validateConditionExpression(expression: string): boolean {
  if (!expression.trim()) return true;

  try {
    // 简单的Groovy表达式验证
    // 这里可以添加更复杂的验证逻辑
    const validPatterns = [
      /^[a-zA-Z_][a-zA-Z0-9_]*\s*[=!<>]+\s*[a-zA-Z0-9_".']+$/, // 简单比较
      /^[a-zA-Z_][a-zA-Z0-9_]*\.equals\([^)]+\)$/, // equals方法
      /^[a-zA-Z_][a-zA-Z0-9_]*\s*[><=!]+\s*\d+$/, // 数字比较
    ];

    return validPatterns.some(pattern => pattern.test(expression.trim()));
  } catch {
    return false;
  }
}

// 格式化条件表达式
export function formatConditionExpression(expression: string): string {
  return expression.trim().replace(/\s+/g, ' ');
}

// 获取节点默认属性
export function getDefaultNodeProperties(nodeType: string): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
    startEvent: { name: '' },
    endEvent: { name: '' },
    userTask: { name: '' },
    exclusiveGateway: { name: '', hookInfoIds: '' },
    parallelGateway: { name: '' },
    inclusiveGateway: { name: '' },
    callActivity: {
      name: '',
      callActivityExecuteType: 'sync',
      callActivityInstanceType: 'single',
      callActivityFlowModuleId: '',
      callActivityInParamType: 'full',
      callActivityOutParamType: 'full',
    },
  };

  return defaults[nodeType] || { name: '' };
}

// 获取顺序流默认属性
export function getDefaultSequenceFlowProperties(): Record<string, any> {
  return {
    name: '',
    defaultConditions: 'false',
    conditionsequenceflow: '',
  };
}
