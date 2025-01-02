import { Layout, Space } from "antd";
import Sidebar from "./Sidebar";
import { Header } from "./Header";
import styles from "./PageLayout.module.scss";
import { RenderRoutes } from "../../routes.tsx";
import { useLocation } from "react-router-dom";

const PageLayout = () => {
  const location = useLocation();
  return (
    <Layout className={styles.root}>
      <Header>
        <Space className="logo-wrapper flex justify-center">
          <img src="/logo.png" width={40} alt="logo" />
        </Space>
      </Header>
      <Layout>
        <Sidebar defaultSelectedKey={location.pathname} />
        <Layout.Content className="overflow-x-auto">
          <div className="p-[15px] flex h-[calc(100vh-64px)]">
            <RenderRoutes />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
