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

  const handleDelete = () => {
    if (data?.onDelete && typeof data.onDelete === 'function') {
      data.onDelete(id);
    }
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
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
          {conditionLabel && (
            <div
              style={{
                fontSize: 12,
                color: token.colorTextSecondary,
                background: token.colorBgContainer,
                padding: '2px 6px',
                borderRadius: 4,
                border: `1px solid ${token.colorBorder}`,
                whiteSpace: 'nowrap',
              }}
            >
              {conditionLabel}
            </div>
          )}
          {hovered && (
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
