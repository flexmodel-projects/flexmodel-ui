import React from "react";
import {useTranslation} from "react-i18next";
import {DeploymentUnitOutlined, FileTextOutlined, LineChartOutlined} from "@ant-design/icons";
import APILog from "@/pages/APILog";
import TabPageContainer from "@/components/common/TabPageContainer";
import {TabMenuItem} from "@/components/common/TabMenu";
import GraphQLAPI from "@/pages/GraphQLAPI";
import UserDefineAPI from "@/pages/UserDefineAPI";
import OpenAPI from "@/pages/OpenAPI";

const ApiView: React.FC = () => {
  const {t} = useTranslation();

  // 标签页配置
  const tabItems: TabMenuItem[] = [
    {
      key: "user-define",
      label: "自定义接口",
      element: UserDefineAPI,
      icon: <DeploymentUnitOutlined/>,
      path: "/api/user-define",
    },
    {
      key: "graphql",
      label: "GraphQL",
      element: GraphQLAPI,
      icon: <DeploymentUnitOutlined/>,
      path: "/api/graphql",
    },
    {
      key: "open_api",
      label: t("open_api"),
      element: OpenAPI,
      icon: <FileTextOutlined/>,
      path: "/api/open-api",
    },
    {
      key: "log",
      label: t("api_log"),
      element: APILog,
      icon: <LineChartOutlined/>,
      path: "/api/log",
    },
  ];

  return (
    <TabPageContainer
      items={tabItems}
      defaultActiveKey="user-define"
      style={{height: '100%'}}
      compact={true}
    />
  );
};

export default ApiView;
