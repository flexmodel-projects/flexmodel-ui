import React from 'react';
import {theme} from 'antd';
import {FixedChatProps} from './types';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';

const FixedChat: React.FC<FixedChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onCancelRequest,
  onToggleFloating,
  onClose,
  onNewChat,
  style,
  onSelectConversation
}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: token.colorBgContainer,
        borderLeft: `1px solid ${token.colorBorder}`,
        ...style
      }}
    >
      {/* 标题栏 */}
      <div style={{
        borderBottom: `1px solid ${token.colorBorderSecondary}`
      }}>
        <ChatHeader
          isFloating={false}
          onToggleFloating={onToggleFloating}
          onClose={onClose}
          onNewChat={onNewChat}
          showCloseButton={!!onClose}
          onSelectConversation={onSelectConversation}
        />
      </div>

      {/* 聊天内容区域 */}
      <ChatContent
        messages={messages}
        isLoading={isLoading}
        onSendMessage={onSendMessage}
        onCancelRequest={onCancelRequest}
      />
    </div>
  );
};

export default FixedChat;
