import {FloatButton, Layout} from "antd";
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
        <Layout.Content style={{overflowX: 'auto'}}>
          <Header/>
          <div style={{padding: '15px', height: 'calc(100vh - 64px)'}}>
            <RenderRoutes/>
          </div>
          <FloatButton.BackTop  visibilityHeight={800}/>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
