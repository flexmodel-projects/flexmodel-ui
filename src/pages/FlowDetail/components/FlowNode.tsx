import {FlowElementType} from '@/pages/FlowDesign/types/flow.ts';
import {NodeInstanceStatus} from '@/services/flow.ts';
import {Handle, Position} from '@xyflow/react';
import {Tag, theme} from 'antd';
import React, {useMemo} from 'react';

interface FlowNodeData {
  name?: string;
  key?: string;
  flowElementType?: number;
  status?: number;
  __selected?: boolean;
  [key: string]: any;
}

interface FlowNodeProps {
  data: FlowNodeData;
}

const FlowNode: React.FC<FlowNodeProps> = ({ data }) => {
  const { token } = theme.useToken();
  const status: number | undefined = data?.status;
  const type: number | undefined = data?.flowElementType;

  const { bgColor, borderColor, textColor, tagColor, tagText } = useMemo(() => {
    // 状态色基于 AntD 设计令牌
    if (status === NodeInstanceStatus.COMPLETED) {
      return {
        bgColor: token.colorSuccessBg,
        borderColor: token.colorSuccessBorder,
        textColor: token.colorSuccessText,
        tagColor: token.colorSuccess,
        tagText: '已完成'
      };
    }
    if (status === NodeInstanceStatus.ACTIVE) {
      return {
        bgColor: token.colorInfoBg,
        borderColor: token.colorInfoBorder,
        textColor: token.colorInfoText,
        tagColor: token.colorInfo,
        tagText: '处理中'
      };
    }
    if (status === NodeInstanceStatus.FAILED) {
      return {
        bgColor: token.colorErrorBg,
        borderColor: token.colorErrorBorder,
        textColor: token.colorErrorText,
        tagColor: token.colorError,
        tagText: '失败'
      };
    }
    if (status === NodeInstanceStatus.DISABLED) {
      return {
        bgColor: token.colorBgContainerDisabled,
        borderColor: token.colorBorderSecondary,
        textColor: token.colorTextTertiary,
        tagColor: token.colorTextTertiary,
        tagText: '撤销'
      };
    }
    return {
      bgColor: token.colorFillSecondary,
      borderColor: token.colorBorderSecondary,
      textColor: token.colorTextSecondary,
      tagColor: token.colorTextSecondary,
      tagText: '未处理'
    };
  }, [status, token]);

  const iconText = useMemo(() => {
    switch (type) {
      case FlowElementType.START_EVENT:
        return 'Start';
      case FlowElementType.END_EVENT:
        return 'End';
      case FlowElementType.USER_TASK:
        return 'User';
      case FlowElementType.SERVICE_TASK:
        return 'Svc';
      case FlowElementType.EXCLUSIVE_GATEWAY:
        return 'XOR';
      case FlowElementType.PARALLEL_GATEWAY:
        return 'AND';
      case FlowElementType.INCLUSIVE_GATEWAY:
        return 'OR';
      case FlowElementType.CALL_ACTIVITY:
        return 'Call';
      default:
        return 'Node';
    }
  }, [type]);

  // 基础容器样式
  const isSelected = Boolean(data?.__selected);

  const baseContainer: React.CSSProperties = {
    background: bgColor,
    border: isSelected ? `2px solid ${token.colorPrimary}` : `1px solid ${borderColor}`,
    color: textColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    boxShadow: isSelected ? `0 0 0 3px ${token.colorPrimaryBorder}` : undefined,
  };

  // 不同节点形状样式
  const isCircle = type === FlowElementType.START_EVENT || type === FlowElementType.END_EVENT;
  const isDiamond = type === FlowElementType.EXCLUSIVE_GATEWAY || type === FlowElementType.PARALLEL_GATEWAY || type === FlowElementType.INCLUSIVE_GATEWAY;

  const shapeStyle: React.CSSProperties = isCircle
    ? { width: 56, height: 56, borderRadius: 999, padding: 0 }
    : isDiamond
      ? { width: 80, height: 80, transform: 'rotate(45deg)', borderRadius: 6, padding: 0 }
      : { minWidth: 140, maxWidth: 240, padding: 12, borderRadius: 8 };

  const displayName: string = (data?.name && String(data?.name).trim()) ? data?.name : (data?.key || '未命名');
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: token.colorTextTertiary }}>{iconText}</span>
        {!isDiamond && (
          <div style={{
            fontWeight: 500,
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {displayName}
          </div>
        )}
      </div>
      {!isDiamond && (
        <Tag color={tagColor as any} style={{ marginRight: 0 }}>{tagText}</Tag>
      )}
      {isDiamond && (
        <div style={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
          <div style={{ fontWeight: 600 }}>{iconText}</div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ ...baseContainer, ...shapeStyle, position: 'relative' }}>
      {/* 只读：左右各一个句柄，提供边连接锚点 */}
      <Handle type="target" id="left" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type="source" id="right" position={Position.Right} style={{ visibility: 'hidden' }} />
      {isCircle || isDiamond ? (
        // 圆形/菱形中居中展示类型文字，状态色由外框体现
        <div style={{ transform: isDiamond ? 'rotate(-45deg)' : undefined, textAlign: 'center', fontWeight: 600 }}>
          {isCircle ? displayName : iconText}
        </div>
      ) : (
        content
      )}
    </div>
  );
};

export default FlowNode;
