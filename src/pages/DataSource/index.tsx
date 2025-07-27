import React, {useEffect, useState} from "react";
import {
  Button,
  Card,
  Divider,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Radio,
  Space,
  Spin,
  theme
} from "antd";
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
import {getCompactCardStyle, getCompactPanelStyle} from '@/utils/theme';
import type {DatasourceSchema} from '@/types/data-source';
import {ScriptImportForm, ScriptType} from '@/types/data-source';
import {EntitySchema, EnumSchema, NativeQuerySchema} from "@/types/data-modeling";

const DatasourceManagement: React.FC = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const [dsList, setDsList] = useState<DatasourceSchema[]>([]);
  const [activeDs, setActiveDs] = useState<DatasourceSchema>({
    name: '',
    type: 'USER',
    config: { dbKind: '' },
    enabled: true,
    createdAt: '',
    updatedAt: ''
  });
  const [modelList, setModelList] = useState<(EntitySchema | EnumSchema | NativeQuerySchema)[]>([]);
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);

  // 修复 useForm 的用法，去掉无效的初始参数，改为 setFieldsValue 设置初始值
  const [scriptForm] = Form.useForm<ScriptImportForm>();
  useEffect(() => {
    // 根据当前选择的type设置相应的script内容
    const currentType = scriptForm.getFieldValue('type') || ScriptType.IDL;
    if (currentType === ScriptType.IDL) {
      const idls = modelList.map((m: any) => m.idl);
      const idlString = idls.join('\n\n');
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
    setModelList(models);
    setExportVisible(true);
    // 重置表单并设置默认值
    scriptForm.resetFields();
    scriptForm.setFieldValue('type', ScriptType.IDL);
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

  // 紧凑主题样式
  const cardStyle = {
    ...getCompactCardStyle(token),
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const layoutStyle = {
    height: '100%',
  };

  const siderStyle = {
    background: 'transparent',
    borderRight: `1px solid ${token.colorBorder}`,
  };

  const contentStyle = {
    paddingLeft: token.marginSM,
    height: '100%',
  };

  const panelContainerStyle = {
    ...getCompactPanelStyle(token),
  };

  return (
    <>
      <Card
        className={`${styles.root} h-full`}
        style={cardStyle}
      >
        <Layout style={layoutStyle}>
          <Layout.Sider
            width={300}
            className={styles.sidebar}
            style={siderStyle}
          >
            <div className={styles.panelContainer} style={panelContainerStyle}>
              <div style={{ padding: token.paddingSM }}>
                <span className={styles.title}>
                  {t("datasource_management")}
                </span>
              </div>
              <Divider style={{ margin: `${token.marginSM} 0` }} />
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
                      className={styles.menuItem}
                    >
                      <span className={styles.menuItemText}>{ds.name}</span>
                      <span className={styles.menuMoreBtn}>
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item
                                className="text-red"
                                icon={<DeleteOutlined />}
                                disabled={ds.type === 'SYSTEM'}
                                onClick={e => {
                                  e.domEvent.stopPropagation();
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
                          <MoreOutlined className="cursor-pointer" onClick={e => e.stopPropagation()} />
                        </Dropdown>
                      </span>
                    </Menu.Item>
                  ))}
                </Menu>
              </Spin>
              <Divider style={{ margin: `${token.marginSM} 0` }} />
              <Button
                type="primary"
                icon={<BlockOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{ width: '100%' }}
                ghost
              >
                {t("connect_datasource")}
              </Button>
            </div>
          </Layout.Sider>
          <Layout.Content
            className={styles.content}
            style={contentStyle}
          >
            <div className={styles.panelContainer} style={panelContainerStyle}>
              <div className={styles.header}>
                <div className={styles.title}>{activeDs.name}</div>
                <div className={styles.actions}>
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
        <Form form={scriptForm} onValuesChange={(changed) => {
          if (changed.type) {
            if (changed.type === 'IDL') {
              const idls = modelList.map((m: any) => m.idl);
              // 当type为IDL时，使用字符串拼接而不是JSON格式
              const idlString = idls.join('\n\n');
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
        }}>
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
    </>
  );
};

export default DatasourceManagement;
