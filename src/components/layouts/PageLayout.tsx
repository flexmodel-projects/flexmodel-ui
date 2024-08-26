import {Layout} from "antd";
import Sidebar from "./Sidebar";
import {Header} from "./Header";
import "./PageLayout.css";
import {RenderRoutes} from "../../routes.tsx";
import {useLocation} from "react-router-dom";

const PageLayout = () => {
  const location = useLocation();
  return (
    <Layout className="ant-layout-has-sider">
      <Sidebar defaultSelectedKey={location.pathname}/>
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
