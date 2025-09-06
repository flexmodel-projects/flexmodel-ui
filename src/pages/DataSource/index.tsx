import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, Layout, message, Modal, Radio, Row, Space} from "antd";
import {useTranslation} from "react-i18next";
import PageContainer from "@/components/common/PageContainer";
import type {DatasourceSchema} from "@/types/data-source";
import {ScriptImportForm, ScriptType} from "@/types/data-source";
import DataSourceExplorer from "@/pages/DataSource/components/DataSourceExplorer";
import {
  deleteDatasource,
  getDatasourceList,
  importModels as reqImportModels,
  updateDatasource,
  validateDatasource,
} from "@/services/datasource.ts";
import ConnectDatabaseDrawer from "@/pages/DataSource/components/ConnectDatabaseDrawer";
import {buildUpdatePayload, mergeDatasource, normalizeDatasource} from "@/pages/DataSource/utils";
import DataSourceView from "@/pages/DataSource/components/DataSourceView";
import DataSourceForm from "@/pages/DataSource/components/DataSourceForm";
import {getModelList} from "@/services/model.ts";
import {EntitySchema, EnumSchema, NativeQuerySchema,} from "@/types/data-modeling";


const DatasourceManagement: React.FC = () => {
  const { t } = useTranslation();
  const [dsList, setDsList] = useState<DatasourceSchema[]>([]);
  const [activeDs, setActiveDs] = useState<DatasourceSchema | null>(null);
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [importVisible, setImportVisible] = useState<boolean>(false);
  const [exportVisible, setExportVisible] = useState<boolean>(false);
  const [modelList, setModelList] = useState<
    (EntitySchema | EnumSchema | NativeQuerySchema)[]
  >([]);
  const [form] = Form.useForm();
  const [scriptForm] = Form.useForm<ScriptImportForm>();


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
      setActiveDs(list[0] || null);
    } catch (error) {
      console.log(error);
      message.error("Failed to load datasource list.");
    } finally {
      setDsLoading(false);
    }
  };

  useEffect(() => {
    getDatasourceListHandler();
  }, []);

  const handleTestConnection = async () => {
    if (!activeDs) return;
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

  const handleEditDatasource = async (formData: any) => {
    try {
      const payload = buildUpdatePayload(formData);
      await updateDatasource(formData.name, payload as DatasourceSchema);
      setIsEditing(false);
      await getDatasourceListHandler();
      if (activeDs) {
        const merged = mergeDatasource(activeDs, formData);
        setActiveDs(merged);
      }
      message.success(t("form_save_success"));
    } catch {
      message.error(t("form_save_failed"));
    }
  };

  const handleDelete = async () => {
    if (activeDs) {
      try {
        await deleteDatasource(activeDs.name);
        getDatasourceListHandler();
        setDeleteVisible(false);
        message.success("Deleted successfully");
      } catch {
        message.error("Failed to delete datasource");
      }
    }
  };

  const handleExport = async () => {
    if (!activeDs) return;
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
    if (!activeDs) return;
    const values = await scriptForm.validateFields();
    reqImportModels(activeDs.name, values).then(() =>
      message.success("Models import successfully")
    );
    setImportVisible(false);
  };

  const { Sider, Content } = Layout;

  return (
    <>
      <PageContainer title={activeDs?.name || t('datasource_management')} extra={
        <>
          {isEditing ? (
            <Space>
              <Button onClick={() => { setIsEditing(false); form.resetFields(); }}>{t("cancel")}</Button>
              <Button type="primary" onClick={async () => { const values = await form.validateFields(); await handleEditDatasource(values); }}>{t("save")}</Button>
            </Space>
          ) : (
            <Space>
              <Button onClick={handleImport}>{t("import")}</Button>
              <Button onClick={handleExport}>{t("export")}</Button>
              <Button onClick={handleTestConnection} loading={testLoading}>
                {t("test")}
              </Button>
              <Button
                type="primary"
                disabled={activeDs?.type === "SYSTEM"}
                onClick={() => { setIsEditing(true); form.setFieldsValue(normalizeDatasource(activeDs as DatasourceSchema)); }}
              >
                {t("edit")}
              </Button>
            </Space>
          )}
        </>
      }>
        <Layout style={{ height: "100%", background: "transparent" }}>
          <Sider width={320} style={{ background: "transparent", borderRight: "1px solid var(--ant-color-border)" }}>
            <div style={{ height: "100%", overflow: "auto" }}>
              <DataSourceExplorer
                dsList={dsList}
                activeDs={activeDs}
                loading={dsLoading}
                setActiveDs={setActiveDs}
                setDeleteVisible={setDeleteVisible}
                setDrawerVisible={setDrawerVisible}
                t={t}
              />
            </div>
          </Sider>
          <Content style={{ padding: "12px 20px", overflow: "auto" }}>
            {dsList.length > 0 && activeDs && (
              <Row>
                <Col span={24}>
                  {isEditing ? (
                    <Form form={form} layout="vertical">
                      <DataSourceForm />
                    </Form>
                  ) : (
                    <DataSourceView data={activeDs} />
                  )}
                </Col>
              </Row>
            )}
          </Content>
        </Layout>
      </PageContainer>

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

      <Modal
        open={deleteVisible}
        title={`Delete '${activeDs?.name}'?`}
        onCancel={() => setDeleteVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete <strong>{activeDs?.name}</strong>?
        </p>
      </Modal>

      <Modal
        width={600}
        open={exportVisible}
        onOk={() => setExportVisible(false)}
        onCancel={() => setExportVisible(false)}
        title={`Export ${activeDs?.name} models`}
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
        title={`Import ${activeDs?.name} models`}
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
