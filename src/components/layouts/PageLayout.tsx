import React from "react";
import {Layout, theme} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {RenderRoutes} from "@/routes";
import {useSidebar} from "@/store/appStore";

const PageLayout: React.FC = () => {
  const { token } = theme.useToken();
  const { isSidebarCollapsed } = useSidebar();

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
            overflow: "auto", // 只允许content区域滚动
            marginTop: token.controlHeight * 1.5, // 为固定的header留出空间
          }}
        >
          <div
            style={{
              padding: token.padding,
              display: 'flex',
              flex: 1,
              minHeight: 0, // 重要：允许 flex 子元素收缩
              gap: token.marginSM,
            }}
          >
            <RenderRoutes />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
