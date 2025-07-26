import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Dropdown, Form, Input, Layout, Menu, message, Modal, Space, Spin} from "antd";
import Icon, {BlockOutlined, DeleteOutlined, MoreOutlined,} from "@ant-design/icons";
import DatabaseInfo from "@/pages/DataSource/components/DatabaseInfo.tsx";
import EditDSConfig from "@/pages/DataSource/components/EditDatabaseModal.tsx";
import ConnectDatabaseDrawer from "@/pages/DataSource/components/ConnectDatabaseDrawer.tsx";
import {
  deleteDatasource,
  getDatasourceList,
  importModels as reqImportModels,
  updateDatasource,
  validateDatasource,
} from "@/services/datasource.ts";
import {DbsMap} from "@/pages/DataSource/common.ts";
import {getModelList} from "@/services/model.ts";
import {useTranslation} from "react-i18next";
import styles from "@/pages/DataSource/index.module.scss";
import type {DatasourceSchema} from '@/types/data-source';

const DatasourceManagement: React.FC = () => {
  const { t } = useTranslation();

  const [dsList, setDsList] = useState<DatasourceSchema[]>([]);
  const [activeDs, setActiveDs] = useState<DatasourceSchema>({
    name: '',
    type: 'USER',
    config: { dbKind: '' },
    enabled: true,
    createdAt: '',
    updatedAt: ''
  });
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);

  const [scriptForm] = Form.useForm();

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
        type: 'USER' as import('@/types/data-source').DatasourceType,
        config: formData.config,
        enabled: formData.enabled,
        createdAt: '',
        updatedAt: ''
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
      <Card className={[styles.root, "h-full"].join(" ")}>
        <Layout style={{height: '70vh', background: 'transparent'}}>
          <Layout.Sider width={240} style={{background: 'transparent', paddingRight: 8}}>
              <div className="truncate" style={{marginBottom: 8}}>
                <span className="text-base font-semibold">
                  {t("datasource_management")}
                </span>
              </div>
              <Divider style={{margin: '8px 0'}} />
              <Spin spinning={dsLoading}>
                <Menu
                  mode="inline"
                  selectedKeys={[activeDs.name]}
                >
                  {dsList.map(ds => (
                    <Menu.Item
                      key={ds.name}
                      icon={<Icon component={DbsMap[ds.config?.dbKind]} />}
                      onClick={() => handleTreeClick(ds)}
                      style={{ display: 'flex', alignItems: 'center', borderRadius: 8, marginBottom: 2, position: 'relative', paddingRight: 32 }}
                    >
                      <span style={{ flex: 1 }}>{ds.name}</span>
                      <span
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'none',
                          zIndex: 2
                        }}
                        className="menu-more-btn"
                      >
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item
                                className="text-red"
                                icon={<DeleteOutlined />}
                                disabled={ds.type === 'SYSTEM'}
                                onClick={e => { e.domEvent.stopPropagation(); setDeleteVisible(true); }}
                              >
                                {t("delete")}
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={["hover"]}
                          placement="bottomRight"
                        >
                          <MoreOutlined className="cursor-pointer" onClick={e => e.stopPropagation()} />
                        </Dropdown>
                      </span>
                    </Menu.Item>
                  ))}
                </Menu>
              </Spin>
              <Divider style={{margin: '8px 0'}} />
              <Button
                type="primary"
                icon={<BlockOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{width: '100%'}}
                ghost
              >
                {t("connect_datasource")}
              </Button>
          </Layout.Sider>
          <Layout.Content style={{paddingLeft: 8, height: '100%'}}>
              <div className="flex justify-between pb-[10px]">
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
                      disabled={activeDs.type === 'SYSTEM'}
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
          </Layout.Content>
        </Layout>
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
