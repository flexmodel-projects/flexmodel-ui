import React from 'react';
import {CloseOutlined, PushpinFilled, PushpinOutlined, RobotOutlined} from '@ant-design/icons';
import {Button, Space, theme} from 'antd';
import {ChatHeaderProps} from './types';

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isFloating = false,
  onToggleFloating,
  onClose,
  showCloseButton = true
}) => {
  const { token } = theme.useToken();

  return (
    <div style={{
      padding: `${token.paddingSM}px ${token.padding}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: token.colorBgElevated
    }}>
      <Space>
        <RobotOutlined style={{ color: token.colorPrimary }} />
        <span style={{
          fontWeight: token.fontWeightStrong,
          color: token.colorText
        }}>AI助手</span>
      </Space>
      <Space>
        <Button
          type="text"
          icon={isFloating ? <PushpinFilled /> : <PushpinOutlined />}
          size="small"
          onClick={() => onToggleFloating?.(!isFloating)}
          style={{ color: token.colorTextSecondary }}
          title={isFloating ? "切换到固定模式" : "切换到悬浮模式"}
        />
        {showCloseButton && onClose && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            size="small"
            onClick={onClose}
            style={{ color: token.colorTextSecondary }}
          />
        )}
      </Space>
    </div>
  );
};

export default ChatHeader;
