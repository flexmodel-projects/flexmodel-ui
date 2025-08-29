import React from 'react';
import {AIChatBoxProps} from './types';
import {useChat} from './useChat';
import FloatingChat from './FloatingChat';
import FixedChat from './FixedChat';

const AIChatBox: React.FC<AIChatBoxProps> = ({
  isVisible = true,
  onToggle,
  style,
  isFloating = false,
  onToggleFloating,
  messages,
  onMessages,
  onSelectConversation
}) => {
  const { messages: chatMessages, isLoading, handleSendMessage } = useChat(messages, onMessages);

  // 处理关闭事件，同时清空消息
  const handleClose = () => {
    onToggle?.(false);
  };

  if (!isVisible) {
    return null;
  }

  // 悬浮模式
  if (isFloating) {
    return (
      <FloatingChat
        messages={chatMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onToggleFloating={onToggleFloating || (() => {})}
        onClose={handleClose}
        onSelectConversation={onSelectConversation}
      />
    );
  }

  // 固定模式
  return (
    <FixedChat
      messages={chatMessages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onToggleFloating={onToggleFloating || (() => {})}
      onClose={onToggle ? handleClose : undefined}
      style={style}
      onSelectConversation={onSelectConversation}
    />
  );
};

export default AIChatBox;
