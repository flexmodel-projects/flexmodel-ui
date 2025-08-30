import React, {useEffect, useState} from 'react';
import {RobotOutlined, UserOutlined} from '@ant-design/icons';
import {Bubble, Sender, Welcome, XProvider} from '@ant-design/x';
import {theme} from 'antd';
import {ChatContentProps} from './types';

const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  isLoading,
  onSendMessage
}) => {
  const { token } = theme.useToken();
  const [chatInputValue, setChatInputValue] = useState<string>();

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      onSendMessage(value);
      setChatInputValue(''); // 清空输入框
    }
  };

  useEffect(() => {
    const chatContainer = document.querySelector('.chat-messages-container');
    if (chatContainer) {
      requestAnimationFrame(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      });
    }
  }, [messages]);

  return (
    <XProvider>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* 对话区域 */}
        <div
          className="chat-messages-container"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: token.paddingSM,
            backgroundColor: token.colorBgContainer,
            display: 'flex',
            flexDirection: 'column',
            gap: token.marginMD
          }}
        >
          {!messages.length &&
            <Welcome
              style={{ padding: 20 }}
              icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
              title="你好, 我是Flexmodel AI助手"
              description="Flexmodel是开源、自主可控的API设计平台，让数据接口开发更简单、更高效"
            />
          }
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
        </div>

        {/* 输入区域 */}
        <div style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: token.paddingSM,
          backgroundColor: token.colorBgContainer
        }}>
          <Sender
            placeholder="请输入您的问题..."
            value={chatInputValue}
            onChange={setChatInputValue}
            onSubmit={handleSubmit}
            disabled={isLoading}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </XProvider>
  );
};

export default ChatContent;
