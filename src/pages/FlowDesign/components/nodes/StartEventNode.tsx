import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {PlayCircleOutlined} from '@ant-design/icons';

const StartEventNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: selected ? '#e6f7ff' : '#f6ffed',
        border: selected ? '2px solid #1890ff' : '2px solid #52c41a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: '#52c41a',
        position: 'relative',
      }}
    >
      <PlayCircleOutlined />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: '#52c41a',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{
          background: '#52c41a',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#52c41a',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{
          background: '#52c41a',
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

export default StartEventNode;
