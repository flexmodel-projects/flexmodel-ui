import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Form, Layout, message, Modal, Row, Space} from "antd";
import {useTranslation} from "react-i18next";
import type {IdentityProvider} from "@/types/identity-provider";
import IdPExplorer from "@/pages/IdentityProvider/components/IdPExplorer";
import {
  deleteIdentityProvider,
  getIdentityProviders as getIdentityProvidersApi,
  updateIdentityProvider,
} from "@/services/identity-provider.ts";
import CreateIdP from "@/pages/IdentityProvider/components/CreateIdP";
import {buildUpdatePayload, mergeIdentityProvider, normalizeIdentityProvider} from "@/pages/IdentityProvider/utils";
import OIDCIdPForm from "@/pages/IdentityProvider/components/OIDCIdPForm";
import JsIdPForm from "@/pages/IdentityProvider/components/JsIdPForm.tsx";
import IdpView from "@/pages/IdentityProvider/components/IdPView";
import {PageContainer} from "@/components/common";

const IdPManagement: React.FC = () => {
  const { t } = useTranslation();
  const [idPList, setIdPList] = useState<IdentityProvider[]>([]);
  const [activeIdP, setActiveIdP] = useState<IdentityProvider | null>(null);
  const [idPLoading, setIdPLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const getIdentityProviders = useCallback(async () => {
    try {
      setIdPLoading(true);
      const data = await getIdentityProvidersApi();
      setIdPLoading(false);
      setIdPList(data);
      setActiveIdP(data[0] || null);
    } catch (error) {
      console.log(error);
      message.error(t("identity_provider_load_failed"));
    }
  }, [t]);

  useEffect(() => {
    getIdentityProviders();
  }, [getIdentityProviders]);

  const handleDelete = async () => {
    if (activeIdP) {
      try {
        await deleteIdentityProvider(activeIdP.name);
        getIdentityProviders();
        setDeleteVisible(false);
        message.success(t("identity_provider_delete_success"));
      } catch {
        message.error(t("identity_provider_delete_failed"));
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

  const { Sider, Content } = Layout;

  return (
    <>
      <PageContainer
        title={activeIdP ? activeIdP.name : t("identity_provider")}
        extra={
          activeIdP && (
            isEditing ? (
              <Space>
                <Button onClick={() => { setIsEditing(false); form.resetFields(); }}>{t("cancel")}</Button>
                <Button type="primary" onClick={async () => { const values = await form.validateFields(); await handleEditProvider(values); }}>{t("save")}</Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => { setIsEditing(true); form.setFieldsValue(normalizeIdentityProvider(activeIdP)); }}>{t("edit")}</Button>
            )
          )
        }
        loading={idPLoading}
      >
        <Layout style={{ height: "100%", background: "transparent" }}>
          <Sider width={320} style={{ background: "transparent", borderRight: "1px solid var(--ant-color-border)" }}>
            <div style={{ height: "100%", overflow: "auto" }}>
              <IdPExplorer
                idPList={idPList}
                activeIdP={activeIdP}
                loading={idPLoading}
                setActiveIdP={setActiveIdP}
                setDeleteVisible={setDeleteVisible}
                setDrawerVisible={setDrawerVisible}
                t={t}
              />
            </div>
          </Sider>
          <Content style={{ padding: "12px 20px", overflow: "auto" }}>
            {idPList.length > 0 && activeIdP && (
              <Row>
                <Col span={24}>
                  {isEditing ? (
                    <Form form={form} layout="vertical">
                      {(form.getFieldValue('type') ?? activeIdP.type ?? activeIdP.provider?.type) === 'js' ? (
                        <JsIdPForm />
                      ) : (
                        <OIDCIdPForm />
                      )}
                    </Form>
                  ) : (
                    <IdpView data={activeIdP} />
                  )}
                </Col>
              </Row>
            )}
          </Content>
        </Layout>
      </PageContainer>
      <CreateIdP
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onConfirm={(res) => {
          getIdentityProviders().then(() => setActiveIdP(res));
        }}
      />
      <Modal
        open={deleteVisible}
        title={t("identity_provider_delete_confirm", { name: activeIdP?.name })}
        onCancel={() => setDeleteVisible(false)}
        onOk={handleDelete}
        okText={t("delete")}
        okButtonProps={{ danger: true }}
      >
        <p
          dangerouslySetInnerHTML={{
            __html: t("identity_provider_delete_confirm_desc", { name: activeIdP?.name })
          }}
        />
      </Modal>
    </>
  );
};

export default IdPManagement;
