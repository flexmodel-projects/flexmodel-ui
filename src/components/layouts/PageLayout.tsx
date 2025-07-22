import {Layout} from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {RenderRoutes} from "../../routes.tsx";

const PageLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header />
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
