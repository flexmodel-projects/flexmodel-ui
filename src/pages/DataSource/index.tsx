import React, {useEffect, useState} from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Radio,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import Icon, {BlockOutlined, DeleteOutlined, MoreOutlined,} from "@ant-design/icons";
import DatabaseInfo from "@/pages/DataSource/components/DatabaseInfo";
import EditDSConfig from "@/pages/DataSource/components/EditDatabaseModal";
import ConnectDatabaseDrawer from "@/pages/DataSource/components/ConnectDatabaseDrawer";
import {
  deleteDatasource,
  getDatasourceList,
  importModels as reqImportModels,
  updateDatasource,
  validateDatasource,
} from "@/services/datasource.ts";
// 导入Tree组件
import Tree from "@/components/explore/explore/Tree.jsx";
// 导入Tree样式
import "@/components/explore/styles/explore.scss";
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
import {getModelList} from "@/services/model.ts";
import {useTranslation} from "react-i18next";

import type {DatasourceSchema} from "@/types/data-source";
import {ScriptImportForm, ScriptType} from "@/types/data-source";
import {EntitySchema, EnumSchema, NativeQuerySchema,} from "@/types/data-modeling";

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

const { Title } = Typography;

const DatasourceManagement: React.FC = () => {
  const { t } = useTranslation();

  const [dsList, setDsList] = useState<DatasourceSchema[]>([]);
  const [activeDs, setActiveDs] = useState<DatasourceSchema>({
    name: "",
    type: "USER",
    config: { dbKind: "" },
    enabled: true,
    createdAt: "",
    updatedAt: "",
  });
  const [modelList, setModelList] = useState<
    (EntitySchema | EnumSchema | NativeQuerySchema)[]
  >([]);
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);

  const [scriptForm] = Form.useForm<ScriptImportForm>();

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
    path: activeDs.name
  };

  // 自定义图标渲染函数
  const renderIcon = (item: any, nodeType: any) => {
    if (nodeType === 'file' && item.datasource) {
      const dbKind = item.datasource.config?.dbKind;
      const IconComponent = DbsMap[dbKind];
      return IconComponent ? <Icon component={IconComponent} /> : <div />;
    }
    return <div />;
  };

  // 更多按钮渲染函数
  const renderMore = (item: any) => {
    if (item.datasource) {
      return (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                className="text-red"
                icon={<DeleteOutlined />}
                disabled={item.datasource.type === "SYSTEM"}
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
            style={{ marginLeft: '8px' }}
          />
        </Dropdown>
      );
    }
    return null;
  };

  useEffect(() => {
    const currentType = scriptForm.getFieldValue("type") || ScriptType.IDL;
    if (currentType === ScriptType.IDL) {
      const idls = modelList.map((m: any) => m.idl);
      const idlString = idls.join("\n\n");
      scriptForm.setFieldValue("script", idlString);
    } else {
      const script = {
        schema: modelList.map((m: any) => ({
          ...m,
          idl: undefined,
        })),
        data: [],
      };
      scriptForm.setFieldValue("script", JSON.stringify(script));
    }
  }, [scriptForm, modelList, exportVisible]);

  const getDatasourceListHandler = async () => {
    try {
      setDsLoading(true);
      const list = await getDatasourceList();
      setDsList(list);
      if (!activeDs.name) {
        setActiveDs(list[0]);
      }
    } catch (error) {
      message.error("Failed to load datasource list.");
      console.error(error);
    } finally {
      setDsLoading(false);
    }
  };

  useEffect(() => {
    getDatasourceListHandler();
  }, []);

  const handleTestConnection = async () => {
    setTestLoading(true);
    try {
      const result = await validateDatasource(activeDs);
      if (result.success) {
        message.success(
          t("test_connection_success_message", { time: result.time })
        );
      } else {
        message.error(
          t("test_connection_fail_message", { msg: result.errorMsg })
        );
      }
    } catch (error) {
      console.log(error);
      message.error(t("test_connection_fail_message_2"));
    } finally {
      setTestLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const res = await updateDatasource(formData.name, {
        name: formData.name,
        type: "USER" as import("@/types/data-source").DatasourceType,
        config: formData.config,
        enabled: formData.enabled,
        createdAt: "",
        updatedAt: "",
      });
      setEditVisible(false);
      setActiveDs(res);
      getDatasourceListHandler();
    } catch (error) {
      console.error(error);
      message.error("Failed to update datasource.");
    }
  };

  const handleDelete = async () => {
    await deleteDatasource(activeDs.name);
    const list = await getDatasourceList();
    setDsList(list);
    setDeleteVisible(false);
  };

  const handleTreeClick = (item: any) => {
    setActiveDs(item);
  };

  const handleExport = async () => {
    const models = await getModelList(activeDs.name);
    setModelList(models);
    setExportVisible(true);
    scriptForm.resetFields();
    scriptForm.setFieldValue("type", ScriptType.IDL);
  };

  const handleImport = () => {
    scriptForm.resetFields();
    setImportVisible(true);
  };

  const importModels = async () => {
    const values = await scriptForm.validateFields();
    reqImportModels(activeDs.name, values).then(() =>
      message.success("Models import successfully")
    );
    setImportVisible(false);
  };

  return (
    <div className="h-full w-full">
      <Row gutter={16} className="h-full">
        {/* 左侧边栏 */}
        <Col span={6} className="h-full">
          <Card
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Title level={5} style={{ margin: 0, marginBottom: "16px" }}>
              {t("datasource_management")}
            </Title>

            <Divider style={{ margin: "16px 0" }} />

            <div style={{ flex: 1, overflow: "auto", marginBottom: "16px" }}>
              <Spin spinning={dsLoading}>
                <Tree
                  tree={treeData}
                  selected={selectedItem}
                  onClickItem={(item) => handleTreeClick(item.datasource)}
                  renderIcon={renderIcon}
                  renderMore={renderMore}
                />
              </Spin>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Button
              type="primary"
              icon={<BlockOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ width: "100%" }}
              ghost
            >
              {t("connect_datasource")}
            </Button>
          </Card>
        </Col>

        {/* 右侧内容区域 */}
        <Col span={18} style={{ height: "100%", paddingLeft: "0x" }}>
          <Card
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            bodyStyle={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {activeDs.name}
              </Title>

              <Space>
                <Button onClick={handleImport}>{t("import")}</Button>
                <Button onClick={handleExport}>{t("export")}</Button>
                <Button onClick={handleTestConnection} loading={testLoading}>
                  {t("test")}
                </Button>
                <Button
                  type="primary"
                  disabled={activeDs.type === "SYSTEM"}
                  onClick={() => setEditVisible(true)}
                >
                  {t("edit")}
                </Button>
              </Space>
            </div>

            <div style={{ flex: 1, overflow: "auto" }}>
              <DatabaseInfo datasource={activeDs} />
            </div>
          </Card>
        </Col>
      </Row>

      <ConnectDatabaseDrawer
        visible={drawerVisible}
        onChange={(data) => {
          getDatasourceListHandler();
          setActiveDs(data);
        }}
        onClose={() => {
          setDrawerVisible(false);
        }}
      />

      <EditDSConfig
        visible={editVisible}
        datasource={activeDs}
        onConfirm={handleEdit}
        onCancel={() => setEditVisible(false)}
      />

      <Modal
        open={deleteVisible}
        title={`${t("delete")} '${activeDs?.name}?'`}
        onCancel={() => setDeleteVisible(false)}
        onOk={handleDelete}
      >
        {t("delete_dialog_text", { name: activeDs?.name })}
      </Modal>

      <Modal
        width={600}
        open={exportVisible}
        onOk={() => setExportVisible(false)}
        onCancel={() => setExportVisible(false)}
        title={`Export ${activeDs.name} models`}
      >
        <Form
          form={scriptForm}
          onValuesChange={(changed) => {
            if (changed.type) {
              if (changed.type === "IDL") {
                const idls = modelList.map((m: any) => m.idl);
                const idlString = idls.join("\n\n");
                scriptForm.setFieldValue("script", idlString);
              } else {
                const script = {
                  schema: modelList.map((m: any) => ({
                    ...m,
                    idl: undefined,
                  })),
                  data: [],
                };
                scriptForm.setFieldValue("script", JSON.stringify(script));
              }
            }
          }}
        >
          <Form.Item label="type" name="type">
            <Radio.Group>
              <Radio value="IDL">IDL</Radio>
              <Radio value="JSON">JSON</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="script">
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width={600}
        open={importVisible}
        onOk={importModels}
        onCancel={() => setImportVisible(false)}
        title={`Import ${activeDs.name} models`}
      >
        <Form form={scriptForm}>
          <Form.Item label="type" name="type">
            <Radio.Group>
              <Radio value="IDL">IDL</Radio>
              <Radio value="JSON">JSON</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="script" required>
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DatasourceManagement;
