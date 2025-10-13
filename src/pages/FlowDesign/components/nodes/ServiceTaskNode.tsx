import React, {useState} from 'react';
import {Handle, NodeProps, Position} from '@xyflow/react';
import {
  CodeOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {Button, theme} from 'antd';

const ServiceTaskNode: React.FC<NodeProps> = ({data, selected, id}) => {
  const [isHovered, setIsHovered] = useState(false);
  const {token} = theme.useToken();

  // 根据 subType 获取图标和颜色
  const getSubTypeIcon = (subType?: string) => {
    const iconProps = {fontSize: '16px'};
    switch (subType) {
      case 'insert_record':
        return <PlusOutlined {...iconProps} style={{color: token.colorSuccess}}/>;
      case 'update_record':
        return <EditOutlined {...iconProps} style={{color: token.colorWarning}}/>;
      case 'query_record':
        return <SearchOutlined {...iconProps} style={{color: token.colorInfo}}/>;
      case 'delete_record':
        return <MinusOutlined {...iconProps} style={{color: token.colorError}}/>;
      case 'js':
        return <CodeOutlined {...iconProps} style={{color: '#f7df1e'}}/>;
      case 'groovy':
        return <CodeOutlined {...iconProps} style={{color: '#4298b8'}}/>;
      default:
        return <SettingOutlined {...iconProps} style={{color: token.colorPrimary}}/>;
    }
  };

  // 根据 subType 获取显示文本
  const getDisplayText = (subType?: string) => {
    const displayName = (data.properties as any)?.name || data.name;

    let baseName: string = '自动任务';
    switch (subType) {
      case 'insert_record':
        baseName = `新增记录`;
        break;
      case 'update_record':
        baseName = `更新记录`;
        break;
      case 'query_record':
        baseName = `查询记录`;
        break;
      case 'delete_record':
        baseName = `删除记录`;
        break;
      case 'delay':
        baseName = `延时节点`;
        break;
      case 'js':
        baseName = 'JS脚本';
        break;
      case 'groovy':
        baseName = 'Groovy脚本';
        break;
      default:
        baseName = '自动任务';
    }
    return displayName || baseName;
  };

  return (
    <div
      style={{
        minWidth: 140,
        minHeight: 64,
        background: selected ? token.colorPrimaryBg : token.colorBgContainer,
        border: `2px solid ${selected ? token.colorPrimary : token.colorBorder}`,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 14px',
        position: 'relative',
        boxShadow: selected ? '0 4px 12px rgba(24, 144, 255, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        {getSubTypeIcon((data.properties as any)?.subType)}
        <div style={{fontSize: '13px', color: token.colorText, fontWeight: 500}}>
          {getDisplayText((data.properties as any)?.subType)}
        </div>
      </div>

      {isHovered && (
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined/>}
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

export default ServiceTaskNode;
