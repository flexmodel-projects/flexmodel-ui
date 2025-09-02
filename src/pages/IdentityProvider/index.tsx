import React, {useEffect, useState} from "react";
import {Button, Card, Col, Empty, Form, message, Modal, Row, Space, Typography} from "antd";
import {useTranslation} from "react-i18next";
import type {IdentityProvider} from "@/types/identity-provider";
import IdPExplorer from "@/pages/IdentityProvider/components/IdPExplorer";
import {
  deleteIdentityProvider,
  getIdentityProviders as getIdentityProvidersApi,
  updateIdentityProvider,
} from "@/services/identity-provider.ts";
import IdPInfo from "@/pages/IdentityProvider/components/IdPView";
import CreateIdP from "@/pages/IdentityProvider/components/CreateIdP";
import {buildUpdatePayload, mergeIdentityProvider, normalizeIdentityProvider} from "@/pages/IdentityProvider/utils";
import OIDCIdPForm from "@/pages/IdentityProvider/components/OIDCIdPForm";
import ScriptIdPForm from "@/pages/IdentityProvider/components/ScriptIdPForm";

const IdPManagement: React.FC = () => {
  const { t } = useTranslation();
  const [idPList, setIdPList] = useState<IdentityProvider[]>([]);
  const [activeIdP, setActiveIdP] = useState<IdentityProvider | null>(null);
  const [idPLoading, setIdPLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const getIdentityProviders = async () => {
    try {
      setIdPLoading(true);
      const data = await getIdentityProvidersApi();
      setIdPLoading(false);
      setIdPList(data);
      setActiveIdP(data[0] || null);
    } catch (error) {
      console.log(error);
      message.error("Failed to load identity providers.");
    }
  };

  useEffect(() => {
    getIdentityProviders();
  }, []);

  const handleDelete = async () => {
    if (activeIdP) {
      try {
        await deleteIdentityProvider(activeIdP.name);
        getIdentityProviders();
        setDeleteVisible(false);
        message.success("Deleted successfully");
      } catch {
        message.error("Failed to delete provider");
      }
    }
  };

  const handleEditProvider = async (formData: any) => {
    try {
      const payload = buildUpdatePayload(formData);
      await updateIdentityProvider(formData.name, payload);
      setIsEditing(false);
      await getIdentityProviders();
      if (activeIdP) {
        const merged = mergeIdentityProvider(activeIdP, formData);
        setActiveIdP(merged);
      }
      message.success(t("form_save_success"));
    } catch {
      message.error(t("form_save_failed"));
    }
  };

  // 紧凑主题样式
  const cardStyle = {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
  };

  // removed custom panel styles

  return (
    <>
      <Card style={cardStyle}>
        <div style={{ display: "flex", flex: 1 }}>
          <IdPExplorer
            idPList={idPList}
            activeIdP={activeIdP}
            idPLoading={idPLoading}
            setActiveIdP={setActiveIdP}
            setDeleteVisible={setDeleteVisible}
            setDrawerVisible={setDrawerVisible}
            t={t}
          />
          <div style={{ width: "100%", padding: "8px 20px" }}>
            {idPList.length > 0 && activeIdP ? (
              <Row>
                <Col span={24}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {activeIdP.name}
                    </Typography.Title>
                    {isEditing ? (
                      <Space>
                        <Button onClick={() => { setIsEditing(false); form.resetFields(); }}>{t("cancel")}</Button>
                        <Button type="primary" onClick={async () => { const values = await form.validateFields(); await handleEditProvider(values); }}>{t("save")}</Button>
                      </Space>
                    ) : (
                      <Button type="primary" onClick={() => { setIsEditing(true); form.setFieldsValue(normalizeIdentityProvider(activeIdP)); }}>{t("edit")}</Button>
                    )}
                  </div>
                </Col>
                <Col span={24}>
                  <Card bordered>
                    {isEditing ? (
                      <Form form={form} layout="vertical">
                        {(form.getFieldValue('type') ?? activeIdP.type ?? activeIdP.provider?.type) === 'script' ? (
                          <ScriptIdPForm />
                        ) : (
                          <OIDCIdPForm />
                        )}
                      </Form>
                    ) : (
                      <IdPInfo idp={activeIdP} />
                    )}
                  </Card>
                </Col>
              </Row>
            ) : (
              <Row justify="center">
                <Empty />
              </Row>
            )}
          </div>
        </div>
      </Card>
      <CreateIdP
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onConfirm={(res) => {
          getIdentityProviders().then(() => setActiveIdP(res));
        }}
      />
      {/* inline editing; modal removed */}
      <Modal
        open={deleteVisible}
        title={`Delete '${activeIdP?.name}'?`}
        onCancel={() => setDeleteVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete <strong>{activeIdP?.name}</strong>?
        </p>
      </Modal>
    </>
  );
};

export default IdPManagement;
