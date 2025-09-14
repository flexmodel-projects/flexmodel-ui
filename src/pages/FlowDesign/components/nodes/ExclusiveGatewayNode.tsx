import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {CloseCircleOutlined} from '@ant-design/icons';

const ExclusiveGatewayNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        background: selected ? '#e6f7ff' : '#fff7e6',
        border: selected ? '2px solid #1890ff' : '2px solid #fa8c16',
        transform: 'rotate(45deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: selected ? '0 4px 12px rgba(24, 144, 255, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: '#fa8c16',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: '#fa8c16',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: '#fa8c16',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          background: '#fa8c16',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#fa8c16',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          background: '#fa8c16',
          width: 8,
          height: 8,
        }}
      />

      <CloseCircleOutlined
        style={{
          fontSize: '20px',
          color: '#fa8c16',
          transform: 'rotate(-45deg)'
        }}
      />

      {data.name ? (
        <div
          style={{
            position: 'absolute',
            bottom: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#666',
            whiteSpace: 'nowrap',
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {String(data.name)}
        </div>
      ) : null}
    </div>
  );
};

export default ExclusiveGatewayNode;
