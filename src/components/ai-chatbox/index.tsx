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
  onMessages
}) => {
  const { messages: chatMessages, isLoading, handleSendMessage } = useChat(messages, onMessages);

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
        onClose={() => onToggle?.(false)}
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
      onClose={onToggle ? () => onToggle(false) : undefined}
      style={style}
    />
  );
};

export default AIChatBox;
