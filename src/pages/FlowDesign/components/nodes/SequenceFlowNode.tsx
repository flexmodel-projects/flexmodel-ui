import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';

const SequenceFlowNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        background: selected ? '#e6f7ff' : '#d9d9d9',
        border: selected ? '2px solid #1890ff' : '2px solid #666',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: '#666',
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: '#666',
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: '#666',
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          background: '#666',
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#666',
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          background: '#666',
          width: 6,
          height: 6,
        }}
      />

      {data.conditionsequenceflow ? (
        <div
          style={{
            position: 'absolute',
            top: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
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
          {String(data.conditionsequenceflow)}
        </div>
      ) : null}
    </div>
  );
};

export default SequenceFlowNode;
