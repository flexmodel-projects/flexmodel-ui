import React from "react";
import {Tabs} from "antd";
import {useTranslation} from "react-i18next";
import DataModeling from "@/pages/DataModeling";
import DataSource from "@/pages/DataSource";
import {ContainerOutlined, DatabaseOutlined} from "@ant-design/icons";
import styles from "@/pages/DataView/index.module.scss";

// 标签页切换的logic处理
const onChange = (key: string) => {
  console.log(key);
};

const DataView: React.FC = () => {
  const { t } = useTranslation();
  // 标签页渲染内容
  const tabContent = [
    {
      key: "modeling",
      label: t("data_modeling"),
      element: DataModeling,
      icon: <ContainerOutlined />,
    },
    {
      key: "source",
      label: t("data_source"),
      element: DataSource,
      icon: <DatabaseOutlined />,
    },
  ];

  return (
    <Tabs
      className={styles.root}
      style={{ flex: 1 }}
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

export default DataView;
