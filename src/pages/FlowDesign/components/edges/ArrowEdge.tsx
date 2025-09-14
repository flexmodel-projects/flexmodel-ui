import React from 'react';
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath} from '@xyflow/react';
import {Button} from 'antd';
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
           stroke: '#666',
           strokeWidth: 2,
           strokeDasharray: '5,5',
           ...style,
         }}
       />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            pointerEvents: 'auto',
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          {(data?.conditionsequenceflow as string) && (
            <div
              style={{
                fontSize: 10,
                color: '#666',
                background: '#fff',
                padding: '2px 4px',
                borderRadius: 4,
                border: '1px solid #d9d9d9',
                whiteSpace: 'nowrap',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {String(data?.conditionsequenceflow || '')}
            </div>
          )}
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
              backgroundColor: '#fff',
              border: '1px solid #d9d9d9',
              borderRadius: '50%',
              color: '#ff4d4f',
              zIndex: 1000,
              pointerEvents: 'auto',
            }}
            title="删除连线"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default ArrowEdge;
