import React from "react";
import {Layout, theme} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {RenderRoutes} from "@/routes";

const PageLayout: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      <Layout style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <Layout.Content
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
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
