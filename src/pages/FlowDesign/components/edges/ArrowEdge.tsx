import React, {useState} from 'react';
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath} from '@xyflow/react';
import {Button, theme} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

const ArrowEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}) => {
  const { token } = theme.useToken();
  const [hovered, setHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const conditionLabel = data?.conditionsequenceflow as string | undefined;
  const isDefault = data?.defaultConditions === 'true';

  const handleDelete = () => {
    if (data?.onDelete && typeof data.onDelete === 'function') {
      data.onDelete(id);
    }
  };

  // 根据选中状态和悬停状态设置边的样式
  const edgeStyle = {
    ...style,
    stroke: selected ? token.colorPrimary : (hovered ? token.colorPrimaryHover : style.stroke),
    strokeWidth: selected ? 2.5 : (hovered ? 2 : (style.strokeWidth || 1.5)),
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      <BaseEdge
        id={`${id}-hover`}
        path={edgePath}
        style={{ stroke: 'transparent', strokeWidth: 20 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'all',
            minWidth: 24,
            minHeight: 24,
          }}
          className="nodrag nopan"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {isDefault && (
            <div
              style={{
                fontSize: 12,
                color: token.colorWarning,
                background: token.colorWarningBg,
                padding: '2px 8px',
                borderRadius: 4,
                border: `1px solid ${token.colorWarningBorder}`,
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}
              title="默认路径：当所有条件都不满足时执行此路径"
            >
              默认
            </div>
          )}
          {conditionLabel && !isDefault && (
            <div
              style={{
                fontSize: 12,
                color: selected ? token.colorPrimary : token.colorTextSecondary,
                background: token.colorBgContainer,
                padding: '2px 6px',
                borderRadius: 4,
                border: `1px solid ${selected ? token.colorPrimary : token.colorBorder}`,
                whiteSpace: 'nowrap',
                fontWeight: selected ? 500 : 400,
              }}
            >
              {conditionLabel}
            </div>
          )}
          {(hovered || selected) && (
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              style={{
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorder}`,
              }}
            />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default ArrowEdge;
