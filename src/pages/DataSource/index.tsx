import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Dropdown, Form, Input, Menu, message, Modal, Space, Spin, Tree,} from "antd";
import Icon, {BlockOutlined, DeleteOutlined, MoreOutlined,} from "@ant-design/icons";
import DatabaseInfo from "./components/DatabaseInfo.tsx";
import EditDSConfig from "./components/EditDatabaseModal.tsx";
import ConnectDatabaseDrawer from "./components/ConnectDatabaseDrawer.tsx";
import {
  deleteDatasource,
  getDatasourceList,
  importModels as reqImportModels,
  updateDatasource,
  validateDatasource,
} from "../../api/datasource.ts";
import {DbsMap} from "./common.ts";
import {getModelList} from "../../api/model.ts";
import {useTranslation} from "react-i18next";
import styles from "./index.module.scss";

const DatasourceManagement: React.FC = () => {
  const { t } = useTranslation();

  const [dsList, setDsList] = useState<any[]>([]);
  const [activeDs, setActiveDs] = useState<any>({
    config: { dbKind: "" },
    createTime: "",
    name: "",
    type: "",
  });
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);

  const [scriptForm] = Form.useForm();

  const fetchDatasourceList = async () => {
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
    fetchDatasourceList();
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
        enabled: activeDs.enabled,
        config: {
          dbKind: formData.dbKind,
          username: formData.username,
          password: formData.password,
          url: formData.url,
        },
      });
      setEditVisible(false);
      setActiveDs(res);
      fetchDatasourceList();
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
    const script = {
      schema: models,
      data: [],
    };
    scriptForm.setFieldValue("script", JSON.stringify(script));
    setExportVisible(true);
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
    <>
      <Card style={{ height: "100%" }} className={styles.root}>
        <div style={{ display: "flex", backgroundColor: "#fff", flex: 1 }}>
          <div
            style={{
              width: "25%",
              borderRight: "1px solid rgba(5, 5, 5, 0.06)",
              padding: "10px 10px 0px 0px",
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "16px" }}>
                {t("datasource_management")}
              </span>
            </div>
            <Divider />
            <Spin spinning={dsLoading}>
              <Tree
                treeData={dsList.map((ds) => ({
                  ...ds,
                  title: ds.name,
                  key: ds.name,
                }))}
                selectedKeys={[activeDs.name]}
                titleRender={(node) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "250px",
                    }}
                  >
                    {<Icon component={DbsMap[node.config?.dbKind]} />}&nbsp;
                    <span>{node.title}</span>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item
                            style={{ color: "red" }}
                            icon={<DeleteOutlined />}
                            disabled={node.type === "system"}
                            onClick={() => {
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
                        style={{ marginLeft: "auto", cursor: "pointer" }}
                      />
                    </Dropdown>
                  </div>
                )}
                onSelect={(_, { node }) => handleTreeClick(node)}
              />
            </Spin>
            <Divider />
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
          <div style={{ width: "75%", padding: "8px 20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "10px",
              }}
            >
              <div>{activeDs.name}</div>
              <div>
                <Space>
                  <Button onClick={handleImport}>{t("import")}</Button>
                  <Button onClick={handleExport}>{t("export")}</Button>
                  <Button onClick={handleTestConnection} loading={testLoading}>
                    {t("test")}
                  </Button>
                  <Button
                    type="primary"
                    disabled={activeDs.type === "system"}
                    onClick={() => setEditVisible(true)}
                  >
                    {t("edit")}
                  </Button>
                </Space>
              </div>
            </div>
            <div>
              <DatabaseInfo datasource={activeDs} />
            </div>
          </div>
        </div>
        <ConnectDatabaseDrawer
          visible={drawerVisible}
          onChange={(data) => {
            fetchDatasourceList();
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
      </Card>
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
        <Form form={scriptForm}>
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
          <Form.Item name="script" required>
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DatasourceManagement;
