import React, {useState} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {DeleteOutlined} from '@ant-design/icons';
import {Button, theme} from 'antd';
import {getNodeBorderColor, getNodeBoxShadow} from '../../utils/nodeStyles';

const EndEventNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { token } = theme.useToken();
  const hasError = (data as any)?.hasError || false;

  return (
    <div
      style={{
        width: 96,
        height: 48,
        background: selected ? token.colorPrimaryBg : token.colorBgContainer,
        border: `2px solid ${getNodeBorderColor(hasError, selected, token.colorError, token.colorPrimary, token.colorBorder)}`,
        borderRadius: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 10px',
        position: 'relative',
        boxShadow: getNodeBoxShadow(hasError, selected, '0 1px 3px rgba(0,0,0,0.08)')
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontSize: 12, color: token.colorText, fontWeight: 500 }}>
        {String((data.properties as any)?.name || data.name || '结束')}
      </span>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: token.colorBorder,
          width: 5,
          height: 5,
        }}
      />

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
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: '50%',
            color: token.colorError,
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          title="删除节点"
        />
      )}
    </div>
  );
};

export default EndEventNode;
