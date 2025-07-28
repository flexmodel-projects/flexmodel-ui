import React from "react";
import {useTranslation} from "react-i18next";
import {DeploymentUnitOutlined, FileTextOutlined, LineChartOutlined} from "@ant-design/icons";
import APIDocument from "../APIDocument";
import APILog from "../APILog";
import APIManagement from "../APIManagement";
import TabPageContainer from "@/components/common/TabPageContainer";
import {TabMenuItem} from "@/components/common/TabMenu";

const ApiView: React.FC = () => {
  const { t } = useTranslation();

  // 标签页配置
  const tabItems: TabMenuItem[] = [
    {
      key: "management",
      label: t("api_management"),
      element: APIManagement,
      icon: <DeploymentUnitOutlined />,
      path: "/api/management",
    },
    {
      key: "document",
      label: t("api_document"),
      element: APIDocument,
      icon: <FileTextOutlined />,
      path: "/api/document",
    },
    {
      key: "log",
      label: t("api_log"),
      element: APILog,
      icon: <LineChartOutlined />,
      path: "/api/log",
    },
  ];

  return (
    <TabPageContainer
      items={tabItems}
      defaultActiveKey="management"
      style={{ height: '100%' }}
      compact={true}
    />
  );
};

export default ApiView;
