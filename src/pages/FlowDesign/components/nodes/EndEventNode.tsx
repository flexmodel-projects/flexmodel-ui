import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {CheckCircleOutlined} from '@ant-design/icons';

const EndEventNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: selected ? '#e6f7ff' : '#fff2f0',
        border: selected ? '2px solid #1890ff' : '2px solid #e83f8d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#e83f8d',
        position: 'relative',
      }}
    >
      <CheckCircleOutlined />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: '#e83f8d',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{
          background: '#e83f8d',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: '#e83f8d',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#e83f8d',
          width: 8,
          height: 8,
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

export default EndEventNode;
