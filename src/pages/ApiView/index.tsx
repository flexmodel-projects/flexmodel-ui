import React from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import {
  DeploymentUnitOutlined,
  FileTextOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import APIDocument from "../APIDocument";
import APILog from "../APILog";
import APIManagement from "../APIManagement";
import styles from "./index.module.scss";

const ApiView: React.FC = () => {
  const { t } = useTranslation();

  // 标签页渲染内容
  const items = [
    {
      key: "management",
      label: t("api_management"),
      children: <APIManagement />,
      icon: <DeploymentUnitOutlined />,
    },
    {
      key: "document",
      label: t("api_document"),
      children: <APIDocument />,
      icon: <FileTextOutlined />,
    },
    {
      key: "log",
      label: t("api_log"),
      children: <APILog />,
      icon: <LineChartOutlined />,
    },
  ];

  return (
    <Tabs
      className={styles.root}
      style={{ flex: 1 }}
      type="card"
      defaultActiveKey="management"
      items={items}
    />
  );
};

export default ApiView;
