import React, {useCallback} from 'react';
import {AIChatBoxProps, Message} from './types';
import {useChat} from './useChat';
import FloatingChat from './FloatingChat';
import FixedChat from './FixedChat';
import {getConversationMessages} from '@/services/chat';

const AIChatBox: React.FC<AIChatBoxProps> = ({
  isVisible = true,
  onToggle,
  style,
  conversationId,
  messages,
  onMessages,
  isFloating = false,
  onToggleFloating,
  onSelectConversation
}) => {
  // 内部维护消息状态（从外部迁移进来）


  const handleMessagesChange = useCallback((newMessages: Message[]) => {
    onMessages(newMessages);
  }, []);

  const { messages: chatMessages, isLoading, handleSendMessage } = useChat(conversationId, messages, handleMessagesChange);

  // 处理关闭事件，同时清空消息
  const handleClose = () => {
    onToggle?.(false);
  };

  const handleNewChat = () => {
    onMessages([]);
  }

  // 处理选择对话：在内部拉取并更新消息
  const handleSelectConversation = useCallback(async (conversationId: string) => {
    try {
      const fetched = await getConversationMessages(conversationId);
      handleMessagesChange(fetched as any);
      onSelectConversation?.(conversationId);
    } catch (e) {
      // 交给上层的 message 机制处理或静默失败
      // 此处不引入 antd 的 message，保持组件纯净
      // 可根据需要增强错误处理
      console.error(e);
    }
  }, [handleMessagesChange, onSelectConversation]);

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
        onToggleFloating={onToggleFloating || (() => { })}
        onClose={handleClose}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
    );
  }

  // 固定模式
  return (
    <FixedChat
      messages={chatMessages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onToggleFloating={onToggleFloating || (() => { })}
      onClose={onToggle ? handleClose : undefined}
      onNewChat={handleNewChat}
      style={style}
      onSelectConversation={handleSelectConversation}
    />
  );
};

export default AIChatBox;
