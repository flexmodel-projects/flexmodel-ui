import React from "react";
import {Layout, theme} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {RenderRoutes} from "../../routes.tsx";

const PageLayout: React.FC = () => {
  const { token } = theme.useToken();
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header />
        <Layout.Content className="overflow-x-auto">
          <div 
            style={{ 
              padding: token.padding,
              display: 'flex',
              height: `calc(100vh - ${token.controlHeight * 1.5}px)`,
              gap: token.marginSM
            }}
          >
            <RenderRoutes />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default React.memo(PageLayout);
