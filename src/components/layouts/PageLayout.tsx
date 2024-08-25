import {Layout} from "antd";
import Sidebar from "./Sidebar";
import {Header} from "./Header";
import "./PageLayout.css";
import {RenderRoutes} from "../routes.tsx";

const PageLayout = () => {
  return (
    <Layout className="ant-layout-has-sider">
      <Sidebar/>
      <Layout>
        <Layout.Content>
          <Header/>
          <RenderRoutes/>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
