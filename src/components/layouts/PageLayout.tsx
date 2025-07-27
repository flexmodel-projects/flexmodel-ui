import React from "react";
import {Layout, theme} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {RenderRoutes} from "../../routes.tsx";

const PageLayout: React.FC = () => {
  const { token } = theme.useToken();
  
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Layout style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Header />
        <Layout.Content 
          className="overflow-hidden" 
          style={{ 
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0 // 重要：允许 flex 子元素收缩
          }}
        >
          <div 
            style={{ 
              padding: token.padding,
              display: 'flex',
              flex: 1,
              minHeight: 0, // 重要：允许 flex 子元素收缩
              gap: token.marginSM,
              overflow: "hidden"
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
