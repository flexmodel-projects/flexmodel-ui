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
          <div style={{padding: '15px'}}>
            <RenderRoutes/>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
