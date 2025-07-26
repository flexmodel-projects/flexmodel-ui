import React from "react";
import {useTranslation} from "react-i18next";
import {DeploymentUnitOutlined, FileTextOutlined, LineChartOutlined,} from "@ant-design/icons";
import APIDocument from "../APIDocument";
import APILog from "../APILog";
import APIManagement from "../APIManagement";
import TabMenu, {TabMenuItem} from "@/components/common/TabMenu";
import styles from "./index.module.scss";

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
    <TabMenu
      items={tabItems}
      defaultActiveKey="management"
      className={styles.root}
      style={{ flex: 1 }}
      compact={true}
    />
  );
};

export default ApiView;
