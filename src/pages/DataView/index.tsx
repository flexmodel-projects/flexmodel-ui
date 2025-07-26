import React from "react";
import {useTranslation} from "react-i18next";
import DataModeling from "@/pages/DataModeling";
import DataSource from "@/pages/DataSource";
import ERView from "./components/ERView";
import {BranchesOutlined, ContainerOutlined, DatabaseOutlined} from "@ant-design/icons";
import TabMenu, {TabMenuItem} from "@/components/common/TabMenu";
import styles from "@/pages/DataView/index.module.scss";

const DataView: React.FC = () => {
  const { t } = useTranslation();

  // 标签页配置
  const tabItems: TabMenuItem[] = [
    {
      key: "modeling",
      label: t("data_modeling"),
      element: DataModeling,
      icon: <ContainerOutlined />,
      path: "/data/modeling",
    },
    {
      key: "source",
      label: t("data_source"),
      element: DataSource,
      icon: <DatabaseOutlined />,
      path: "/data/source",
    },
    {
      key: "er",
      label: t("er_view"),
      element: ERView,
      icon: <BranchesOutlined />,
      path: "/data/er",
    },
  ];

  return (
    <TabMenu
      items={tabItems}
      defaultActiveKey="modeling"
      className={styles.root}
      style={{ flex: 1 }}
      compact={true}
    />
  );
};

export default DataView;
