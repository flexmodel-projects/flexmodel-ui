import {
  CloseOutlined,
  MessageOutlined,
  PushpinFilled,
  PushpinOutlined,
  RobotOutlined,
  UserOutlined
} from '@ant-design/icons';
import {Bubble, Sender, XProvider} from '@ant-design/x';
import {Button, FloatButton, Space, theme} from 'antd';
import React, {useEffect, useRef, useState} from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBoxProps {
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
  style?: React.CSSProperties;
  isFloating?: boolean;
  onToggleFloating?: (floating: boolean) => void;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({
  isVisible = true,
  onToggle,
  style,
  isFloating = false,
  onToggleFloating
}) => {
  const { token } = theme.useToken();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！👋 我是基于 Ant Design X 构建的AI助手。我可以和你聊天、回答问题，或者只是陪你解闷。\n\n试试问我：\n• "你好" - 打个招呼\n• "天气" - 聊聊天气\n• "时间" - 查看当前时间\n• "帮助" - 了解我的功能\n• "笑话" - 听个笑话\n• "技术" - 讨论技术话题\n\n有什么想聊的吗？😊',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 悬浮模式的位置状态
  const [floatingPosition, setFloatingPosition] = useState({ x: window.innerWidth - 420, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const floatingRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleMouseMove = (e: MouseEvent) => {
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
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // 模拟AI响应
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // 模拟AI响应延迟
    setTimeout(() => {
      // 根据用户输入生成不同的模拟响应
      let aiResponse = '';

      if (content.toLowerCase().includes('你好') || content.toLowerCase().includes('hello')) {
        aiResponse = '你好！很高兴见到你！我是基于 Ant Design X 构建的AI助手。我可以帮助你解答问题、提供建议或者只是聊天。有什么我可以帮助你的吗？';
      } else if (content.toLowerCase().includes('天气')) {
        aiResponse = '今天天气不错呢！虽然我是模拟的AI助手，无法获取实时天气信息，但我建议你可以看看窗外，感受一下大自然的美好。如果天气好的话，不妨出去走走，呼吸新鲜空气！';
      } else if (content.toLowerCase().includes('时间')) {
        aiResponse = `现在是 ${new Date().toLocaleString('zh-CN')}。时间过得真快，记得合理安排你的时间，既要工作学习，也要注意休息哦！`;
      } else if (content.toLowerCase().includes('帮助') || content.toLowerCase().includes('help')) {
        aiResponse = '我可以帮助你：\n• 回答问题\n• 提供建议\n• 聊天解闷\n• 技术讨论\n\n虽然这只是模拟对话，但我很乐意和你交流！';
      } else if (content.toLowerCase().includes('技术') || content.toLowerCase().includes('编程')) {
        aiResponse = '关于技术问题，我可以和你讨论：\n• React 开发\n• Ant Design 组件库\n• TypeScript 编程\n• 前端架构设计\n\n有什么具体的技术问题想讨论吗？';
      } else if (content.toLowerCase().includes('笑话') || content.toLowerCase().includes('幽默')) {
        aiResponse = '哈哈，让我给你讲个程序员笑话：\n\n为什么程序员总是分不清万圣节和圣诞节？\n因为 Oct 31 == Dec 25！\n\n（八进制的31等于十进制的25）😄';
      } else if (content.toLowerCase().includes('谢谢') || content.toLowerCase().includes('感谢')) {
        aiResponse = '不客气！很高兴能帮到你。如果还有其他问题，随时可以问我。记住，虽然我是模拟的AI，但我很享受和你的每一次对话！';
      } else {
        // 默认响应
        const responses = [
          `我收到了你的消息："${content}"。这是一个很有趣的话题！虽然我是模拟的AI助手，但我很乐意和你继续讨论。`,
          `你说得对，关于"${content}"这个话题，我觉得很有讨论的价值。让我们继续深入交流吧！`,
          `很有意思的观点！关于"${content}"，我想听听你的更多想法。`,
          `谢谢你的分享！"${content}"这个话题确实值得思考。你有什么特别的想法吗？`,
          `我理解你的意思。关于"${content}"，我们可以从多个角度来分析这个问题。`
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // 聊天内容组件
  const ChatContent = () => (
    <XProvider>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* 对话区域 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: token.paddingSM,
          backgroundColor: token.colorBgContainer,
          display: 'flex',
          flexDirection: 'column',
          gap: token.marginMD
        }}>
          {messages.map((message, index) => (
            <Bubble
              key={message.id}
              content={message.content}
              placement={message.role === 'user' ? 'end' : 'start'}
              avatar={
                message.role === 'assistant' ?
                  {
                    icon: <RobotOutlined />,
                    style: {
                      backgroundColor: token.colorPrimary
                    }
                  } :
                  {
                    icon: <UserOutlined />,
                    style: {
                      backgroundColor: token.colorSuccess
                    }
                  }
              }
              styles={
                index > 0 && messages[index - 1].role === message.role ?
                  { avatar: { visibility: 'hidden' } } :
                  {}
              }
            />
          ))}

          {isLoading && (
            <Bubble
              content="🤔 AI正在思考中..."
              placement="start"
              avatar={{
                icon: <RobotOutlined />,
                style: {
                  backgroundColor: token.colorPrimary
                }
              }}
              loading={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: token.paddingSM,
          backgroundColor: token.colorBgContainer
        }}>
          <Sender
            placeholder="请输入您的问题..."
            onSubmit={handleSendMessage}
            disabled={isLoading}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </XProvider>
  );

  if (!isVisible) {
    return null;
  }

  // 悬浮模式
  if (isFloating) {
    return (
      <>
        {/* 悬浮按钮 */}
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          onClick={() => onToggle?.(true)}
          style={{
            right: 24,
            bottom: 24,
            zIndex: 1000
          }}
          tooltip="AI助手 (悬浮模式)"
        />

        {/* 可拖动的悬浮聊天窗口 */}
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
            boxShadow: token.boxShadowSecondary,
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
              padding: `${token.paddingSM}px ${token.padding}px`,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: token.colorBgElevated,
              cursor: 'grab',
              userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
          >
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
              <Button
                type="text"
                icon={<CloseOutlined />}
                size="small"
                onClick={() => onToggle?.(false)}
                style={{ color: token.colorTextSecondary }}
              />
            </Space>
          </div>

          {/* 聊天内容区域 */}
          <ChatContent />
        </div>
      </>
    );
  }

  // 固定模式
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: token.colorBgContainer,
        borderLeft: `1px solid ${token.colorBorder}`,
        ...style
      }}
    >
      {/* 标题栏 */}
      <div style={{
        padding: `${token.paddingSM}px ${token.padding}px`,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
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
          {onToggle && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              size="small"
              onClick={() => onToggle(false)}
              style={{ color: token.colorTextSecondary }}
            />
          )}
        </Space>
      </div>

      {/* 聊天内容区域 */}
      <ChatContent />
    </div>
  );
};

export default AIChatBox;
