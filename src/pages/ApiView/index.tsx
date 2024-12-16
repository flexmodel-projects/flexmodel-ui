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

// 标签页切换的logic处理
const onChange = (key: string) => {
  console.log(key);
};

const ApiView: React.FC = () => {
  const { t } = useTranslation();

  // 标签页渲染内容
  const tabContent = [
    {
      key: "management",
      label: t("api_management"),
      element: APIManagement,
      icon: <DeploymentUnitOutlined />,
    },
    {
      key: "document",
      label: t("api_document"),
      element: APIDocument,
      icon: <FileTextOutlined />,
    },
    {
      key: "log",
      label: t("api_log"),
      element: APILog,
      icon: <LineChartOutlined />,
    },
  ];

  return (
    <Tabs
      onChange={onChange}
      type="card"
      items={tabContent.map((content) => {
        const { label, key, icon } = content;

        return {
          label,
          key,
          children: <content.element />,
          icon,
        };
      })}
    />
  );
};

export default ApiView;
