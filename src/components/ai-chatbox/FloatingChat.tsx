import React, {useCallback, useEffect, useRef, useState} from 'react';
import {theme} from 'antd';
import {FloatingChatProps} from './types';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';

const FloatingChat: React.FC<FloatingChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onCancelRequest,
  onToggleFloating,
  onClose,
  onNewChat,
  onSelectConversation
}) => {
  const { token } = theme.useToken();
  const [floatingPosition, setFloatingPosition] = useState({ x: window.innerWidth - 420, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const floatingRef = useRef<HTMLDivElement>(null);

  // 拖动相关事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!floatingRef.current) return;

    const rect = floatingRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // 限制在屏幕范围内
    const maxX = window.innerWidth - 400;
    const maxY = window.innerHeight - 600;

    setFloatingPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={floatingRef}
      style={{
        position: 'fixed',
        top: floatingPosition.y,
        left: floatingPosition.x,
        width: 400,
        height: 600,
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
        border: `1px solid ${token.colorBorder}`,
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* 可拖动的标题栏 */}
      <div
        style={{
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgElevated,
          cursor: 'grab',
          userSelect: 'none',
          transition: 'background-color 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.backgroundColor = token.colorBgLayout;
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.backgroundColor = token.colorBgElevated;
          }
        }}
      >
        <ChatHeader
          isFloating={true}
          onToggleFloating={onToggleFloating}
          onClose={onClose}
          onNewChat={onNewChat}
          showCloseButton={true}
          onSelectConversation={onSelectConversation}
        />
      </div>

      {/* 聊天内容区域 */}
      <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <ChatContent
          messages={messages}
          isLoading={isLoading}
          onSendMessage={onSendMessage}
          onCancelRequest={onCancelRequest}
        />
      </div>
    </div>
  );
};

export default FloatingChat;
