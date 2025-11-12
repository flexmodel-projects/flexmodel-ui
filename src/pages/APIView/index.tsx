import React from "react";
import {useTranslation} from "react-i18next";
import {DeploymentUnitOutlined, FileTextOutlined, LineChartOutlined} from "@ant-design/icons";
import APILog from "@/pages/APILog";
import TabPageContainer from "@/components/common/TabPageContainer";
import {TabMenuItem} from "@/components/common/TabMenu";
import GraphQLAPI from "@/pages/GraphQLAPI";
import CustomAPI from "@/pages/CustomAPI";
import OpenAPI from "@/pages/OpenAPI";

const ApiView: React.FC = () => {
  const {t} = useTranslation();

  // 标签页配置
  const tabItems: TabMenuItem[] = [
    {
      key: "custom_api",
      label: t("custom_api"),
      element: CustomAPI,
      icon: <DeploymentUnitOutlined/>,
      path: "/api/custom-api",
    },
    {
      key: "graphql_api",
      label: t("graphql_api"),
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
      defaultActiveKey="custom_api"
    />
  );
};

export default ApiView;
