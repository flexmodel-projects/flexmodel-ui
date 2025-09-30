import React from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {MinusCircleOutlined} from '@ant-design/icons';
import {theme} from 'antd';

const InclusiveGatewayNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        width: 60,
        height: 60,
        background: selected ? token.colorPrimaryBg : token.colorBgContainer,
        border: `2px solid ${selected ? token.colorPrimary : token.colorBorder}`,
        transform: 'rotate(45deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 8,
        boxShadow: selected ? '0 4px 12px rgba(24, 144, 255, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: token.colorBorder,
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: token.colorBorder,
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: token.colorBorder,
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          background: token.colorBorder,
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: token.colorBorder,
          width: 6,
          height: 6,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          background: token.colorBorder,
          width: 6,
          height: 6,
        }}
      />

      <MinusCircleOutlined
        style={{
          fontSize: '20px',
          color: token.colorPrimary,
          transform: 'rotate(-45deg)'
        }}
      />

      {((data.properties as any)?.name || data.name) ? (
        <div
          style={{
            position: 'absolute',
            bottom: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: token.colorTextSecondary,
            whiteSpace: 'nowrap',
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {String((data.properties as any)?.name || data.name)}
        </div>
      ) : null}
    </div>
  );
};

export default InclusiveGatewayNode;
