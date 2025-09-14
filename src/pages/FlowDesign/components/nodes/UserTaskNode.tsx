import React, {useState} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {DeleteOutlined, UserOutlined} from '@ant-design/icons';
import {Button} from 'antd';

const UserTaskNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        minWidth: 120,
        minHeight: 60,
        background: selected ? '#e6f7ff' : '#f0f9ff',
        border: selected ? '2px solid #1890ff' : '2px solid #1890ff',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
        position: 'relative',
        boxShadow: selected ? '0 4px 12px rgba(24, 144, 255, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: '#1890ff',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: '#1890ff',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: '#1890ff',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          background: '#1890ff',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#1890ff',
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          background: '#1890ff',
          width: 8,
          height: 8,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <UserOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
        <div style={{ fontSize: '12px', color: '#1890ff', fontWeight: 500 }}>
          {String(data.name || '用户任务')}
        </div>
      </div>

      {isHovered && (
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            if (data?.onDelete && typeof data.onDelete === 'function') {
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
            backgroundColor: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '50%',
            color: '#ff4d4f',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          title="删除节点"
        />
      )}
    </div>
  );
};

export default UserTaskNode;
