import React from "react";
import {Button, Divider, Dropdown, Menu, Spin, Typography} from "antd";
import Icon, {BlockOutlined, DeleteOutlined, MoreOutlined} from "@ant-design/icons";
// 导入Tree组件
import Tree from "@/components/explore/explore/Tree.jsx";
// 导入Tree样式
import "@/components/explore/styles/explore.scss";
import type {DatasourceSchema} from "@/types/data-source";
// 数据库图标映射
import MySQL from "@/assets/icons/svg/mysql.svg?react";
import MariaDB from "@/assets/icons/svg/mariadb.svg?react";
import Oracle from "@/assets/icons/svg/oracle.svg?react";
import SqlServer from "@/assets/icons/svg/sqlserver.svg?react";
import PostgreSQL from "@/assets/icons/svg/postgresql.svg?react";
import DB2 from "@/assets/icons/svg/db2.svg?react";
import SQLite from "@/assets/icons/svg/sqlite.svg?react";
import GBase from "@/assets/icons/svg/gbase.svg?react";
import DM8 from "@/assets/icons/svg/dm.svg?react";
import TiDB from "@/assets/icons/svg/tidb.svg?react";
import MongoDB from "@/assets/icons/svg/mongodb.svg?react";

const { Title } = Typography;

const DbsMap: Record<string, any> = {
  mysql: MySQL,
  mariadb: MariaDB,
  oracle: Oracle,
  sqlserver: SqlServer,
  postgresql: PostgreSQL,
  db2: DB2,
  sqlite: SQLite,
  gbase: GBase,
  dm: DM8,
  tidb: TiDB,
  mongodb: MongoDB,
};

interface DataSourceExplorerProps {
  dsList: DatasourceSchema[];
  activeDs: DatasourceSchema | null;
  loading: boolean;
  setActiveDs: (ds: DatasourceSchema) => void;
  setDeleteVisible: (visible: boolean) => void;
  setDrawerVisible: (visible: boolean) => void;
  t: (key: string) => string;
}

const DataSourceExplorer: React.FC<DataSourceExplorerProps> = ({
  dsList,
  activeDs,
  loading,
  setActiveDs,
  setDeleteVisible,
  setDrawerVisible,
  t,
}) => {
  // 将数据源列表转换为Tree组件需要的数据结构
  const treeData = {
    children: dsList.map((ds) => ({
      type: 'file' as const,
      filename: ds.name,
      path: ds.name,
      datasource: ds, // 保存原始数据源对象
    }))
  };

  // 当前选中的数据源
  const selectedItem = {
    path: activeDs?.name || ''
  };

  // 自定义图标渲染函数
  const renderIcon = (item: any, nodeType: any) => {
    if (nodeType === 'file' && item.datasource) {
      const dbKind = item.datasource.config?.dbKind;
      const IconComponent = DbsMap[dbKind];
      return IconComponent ? <Icon component={IconComponent} style={{ fontSize: '16px' }} /> : <div />;
    }
    return <div />;
  };

  // 更多按钮渲染函数
  const renderMore = (item: any) => {
    if (item.datasource && item.datasource.type !== "SYSTEM") {
      return (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                className="text-red"
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                  setActiveDs(item.datasource);
                  setDeleteVisible(true);
                }}
              >
                {t("delete")}
              </Menu.Item>
            </Menu>
          }
          trigger={["hover"]}
          placement="bottomRight"
        >
          <MoreOutlined
            className="cursor-pointer opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      );
    }
    return null;
  };

  return (
    <div style={{ minWidth: 200 }}>
      <Spin spinning={loading}>
        <Tree
          tree={treeData}
          selected={selectedItem}
          onClickItem={(item) => setActiveDs(item.datasource)}
          renderIcon={renderIcon}
          renderMore={renderMore}
        />
      </Spin>
      <Divider style={{ margin: "8px 0" }} />
      <Button
        type="primary"
        icon={<BlockOutlined />}
        onClick={() => setDrawerVisible(true)}
        style={{ width: "100%" }}
        ghost
      >
        {t("connect_datasource")}
      </Button>
    </div>
  );
};

export default DataSourceExplorer;
