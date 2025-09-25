import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {theme} from 'antd';

const StartEventNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        width: 96,
        height: 48,
        background: selected ? token.colorPrimaryBg : token.colorBgContainer,
        border: `2px solid ${selected ? token.colorPrimary : token.colorBorder}`,
        borderRadius: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10px',
        position: 'relative',
        boxShadow: selected ? '0 4px 12px rgba(24,144,255,0.25)' : '0 1px 3px rgba(0,0,0,0.08)'
      }}
    >
      <span style={{ fontSize: 12, color: token.colorText, fontWeight: 500 }}>{String(data.name || '开始')}</span>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />
    </div>
  );
};

export default StartEventNode;
