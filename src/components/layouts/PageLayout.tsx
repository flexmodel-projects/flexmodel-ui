import React from "react";
import {Layout, theme} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {RenderRoutes} from "../../routes.tsx";

const PageLayout: React.FC = () => {
  const { token } = theme.useToken();
  
  return (
    <Layout style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <Header />
        <Layout.Content 
          className="overflow-hidden" 
          style={{ 
            height: `calc(100vh - ${token.controlHeight * 1.5}px)`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div 
            style={{ 
              padding: token.padding,
              display: 'flex',
              flex: 1,
              height: '100%',
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
