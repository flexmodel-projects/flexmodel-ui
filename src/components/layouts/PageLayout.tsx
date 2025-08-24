import React, {useState} from "react";
import {FloatButton, Layout, Splitter, theme} from "antd";
import {RobotOutlined} from "@ant-design/icons";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {RenderRoutes} from "@/routes";
import {useChat, useSidebar} from "@/store/appStore";
import AIChatBox from "@/components/ai-chatbox/index";
import {Message} from "@/components/ai-chatbox/types";

const PageLayout: React.FC = () => {
  const { token } = theme.useToken();
  const { isSidebarCollapsed } = useSidebar();
  const { messages, setMessages } = useChat();
  const [isAIChatVisible, setIsAIChatVisible] = useState(false);
  const [isAIChatFloating, setIsAIChatFloating] = useState(false);

  // 处理消息变更的回调函数
  const handleMessagesChange = (newMessages: Message[]) => {
    console.log('消息已更新:', newMessages);
    setMessages(newMessages);
  };

  return (
    <Layout style={{
      height: "100vh",
      overflow: "hidden" // 防止整体页面滚动
    }}>
      <Sidebar />
      <Layout style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // 防止右侧布局滚动
        marginLeft: isSidebarCollapsed ? 56 : 180, // 为固定的sidebar留出空间
        transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)" // 与sidebar动画同步
      }}>
        <Header />
        <Layout.Content
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // 重要：允许 flex 子元素收缩
            overflow: "hidden", // 改为hidden，让Splitter控制滚动
            marginTop: token.controlHeight * 1.5, // 为固定的header留出空间
          }}
        >
          <Splitter style={{ height: '100%' }}>
            <Splitter.Panel style={{
              padding: token.padding,
              display: 'flex',
              flex: 1,
              minHeight: 0,
              overflow: 'auto'
            }}>
              <RenderRoutes />
            </Splitter.Panel>

            {/* 固定模式下的AI聊天面板 */}
            {isAIChatVisible && !isAIChatFloating && (
              <Splitter.Panel
                defaultSize="25%"
                style={{
                  overflow: 'hidden'
                }}
              >
                <AIChatBox
                  messages={messages}
                  isVisible={isAIChatVisible}
                  onToggle={setIsAIChatVisible}
                  isFloating={isAIChatFloating}
                  onToggleFloating={setIsAIChatFloating}
                  onMessages={handleMessagesChange}
                />
              </Splitter.Panel>
            )}
          </Splitter>
        </Layout.Content>
      </Layout>

      {/* 悬浮模式下的AI聊天面板 */}
      {isAIChatFloating && (
        <AIChatBox
          messages={messages}
          isVisible={isAIChatVisible}
          onToggle={setIsAIChatVisible}
          isFloating={isAIChatFloating}
          onToggleFloating={setIsAIChatFloating}
          onMessages={handleMessagesChange}
        />
      )}

      {/* 悬浮按钮 - 只在AI聊天面板隐藏时显示 */}
      {!isAIChatVisible && (
        <FloatButton
          icon={<RobotOutlined />}
          type="primary"
          onClick={() => setIsAIChatVisible(true)}
          style={{
            right: 24,
            bottom: 24,
            zIndex: 1000
          }}
          tooltip="AI助手"
        />
      )}
    </Layout>
  );
};

export default PageLayout;
