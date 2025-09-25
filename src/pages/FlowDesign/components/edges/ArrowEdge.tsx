import React, {useEffect, useState} from 'react';
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

  // 注入一次性动画样式，用于虚线流动效果
  useEffect(() => {
    const styleId = 'flow-edge-dash-anim-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `@keyframes flow-dash { to { stroke-dashoffset: -12; } }`;
      document.head.appendChild(style);
    }
  }, []);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
         id={id}
         path={edgePath}
         markerEnd={markerEnd}
         style={{
          stroke: token.colorTextSecondary,
          strokeWidth: 1.5,
          strokeDasharray: '6 6',
          strokeLinecap: 'round',
          animation: 'flow-dash 1.6s linear infinite',
           ...style,
         }}
       />
      {/* 透明的悬浮感应路径，扩大 hover 可触发区域 */}
      <BaseEdge
        id={`${id}-hover`}
        path={edgePath}
        style={{ stroke: 'transparent', strokeWidth: 14 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'auto',
            zIndex: 1000,
            // 为了能触发悬浮，即使没有条件标签也保留一个透明的热区
            minWidth: 24,
            minHeight: 24,
            padding: 2,
            background: 'transparent',
          }}
          className="nodrag nopan"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {(data?.conditionsequenceflow as string) && (
            <div
              style={{
                fontSize: 10,
                color: token.colorTextSecondary,
                background: token.colorBgContainer,
                padding: '2px 4px',
                borderRadius: 4,
                border: `1px solid ${token.colorBorder}`,
                whiteSpace: 'nowrap',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {String(data?.conditionsequenceflow || '')}
            </div>
          )}
          {hovered && (
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Delete button clicked for edge:', id);
              if (data?.onDelete && typeof data.onDelete === 'function') {
                console.log('Calling onDelete for edge:', id);
                data.onDelete(id);
              } else {
                console.log('onDelete function not found or not a function');
              }
            }}
            style={{
              width: 20,
              height: 20,
              minWidth: 20,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: token.colorBgContainer,
              border: `1px solid ${token.colorBorder}`,
              borderRadius: '50%',
              color: token.colorError,
              zIndex: 1000,
              pointerEvents: 'auto',
            }}
            title="删除连线"
          />)}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default ArrowEdge;
