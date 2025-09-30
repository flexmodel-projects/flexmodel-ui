import React, {useState} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {Button} from 'antd';
import {DeleteOutlined, LinkOutlined} from '@ant-design/icons';

const CallActivityNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        width: 120,
        height: 60,
        background: selected ? '#e6f7ff' : '#f6ffed',
        border: selected ? '2px solid #1890ff' : '2px solid #722ed1',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#722ed1',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: '#722ed1',
          width: 8,
          height: 8,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <LinkOutlined style={{ fontSize: '14px' }} />
        <span style={{ fontWeight: 500 }}>{(data?.properties as any)?.name || data?.label as string || '子流程'}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: '#722ed1',
          width: 8,
          height: 8,
        }}
      />

      {isHovered && data?.onDelete && typeof data.onDelete === 'function' ? (
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={e => {
            e.stopPropagation();
            if (typeof data.onDelete === 'function') {
              data.onDelete(id);
            }
          }}
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            minWidth: 20,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--ant-color-error)',
            borderColor: 'var(--ant-color-error)',
            color: 'var(--ant-color-white)',
            borderRadius: '50%',
            fontSize: '10px',
            zIndex: 1000,
          }}
        />
      ) : null}
    </div>
  );
};

export default CallActivityNode;
