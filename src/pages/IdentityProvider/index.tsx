import React, {useEffect, useState} from "react";
import {Button, Card, Col, Empty, message, Modal, Row, theme} from "antd";
import {useTranslation} from "react-i18next";
import styles from "@/pages/IdentityProvider/index.module.scss";
import {getCompactCardStyle, getCompactPanelStyle} from '@/utils/theme';
import type {IdentityProvider} from "@/types/identity-provider";
import IdPMenu from "@/pages/IdentityProvider/components/IdPMenu.tsx";
import {
  deleteIdentityProvider,
  getIdentityProviders as getIdentityProvidersApi,
  updateIdentityProvider,
} from "@/services/identity-provider.ts";
import IdPInfo from "@/pages/IdentityProvider/components/IdPInfo.tsx";
import EditProvider from "@/pages/IdentityProvider/components/EditProvider.tsx";
import CreateProvider from "@/pages/IdentityProvider/components/CreateProvider.tsx";


const IdPManagement: React.FC = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [idPList, setIdPList] = useState<IdentityProvider[]>([]);
  const [activeIdP, setActiveIdP] = useState<IdentityProvider | null>(null);
  const [idPLoading, setIdPLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<IdentityProvider | null>(null);

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

  const handleEditProvider = async (formData: IdentityProvider) => {
    try {
      const reqData: IdentityProvider = { ...formData, provider: formData };
      await updateIdentityProvider(formData.name, {
        ...formData,
        provider: formData,
        createdAt: '',
        updatedAt: ''
      });
      setEditVisible(false);
      await getIdentityProviders();
      setActiveIdP(reqData);
      message.success(t("form_save_success"));
    } catch {
      message.error(t("form_save_failed"));
    }
  };

  // 紧凑主题样式
  const cardStyle = {
    ...getCompactCardStyle(token),
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const panelContainerStyle = {
    ...getCompactPanelStyle(token),
  };

  return (
    <>
      <Card 
        className={`${styles.root} h-full w-full`}
        style={cardStyle}
      >
        <div className={styles.container}>
          <IdPMenu
            idPList={idPList}
            activeIdP={activeIdP}
            idPLoading={idPLoading}
            setActiveIdP={setActiveIdP}
            setDeleteVisible={setDeleteVisible}
            setDrawerVisible={setDrawerVisible}
            t={t}
          />
          <div className={`${styles.content} ${styles.panelContainer}`} style={panelContainerStyle}>
            {idPList.length > 0 && activeIdP ? (
              <Row>
                <Col span={24}>
                  <div className={styles.header}>
                    <div className={styles.title}>{activeIdP.name}</div>
                    <Button
                      type="primary"
                      onClick={() => {
                        console.log("activeIdP", activeIdP);
                        setEditForm(activeIdP);
                        setEditVisible(true);
                      }}
                    >
                      {t("edit")}
                    </Button>
                  </div>
                </Col>
                <Col span={24}>
                  <Card bordered={false} className={styles.infoCard}>
                    <IdPInfo data={{
                      name: activeIdP.name,
                      provider: activeIdP.provider
                    }} />
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
      <CreateProvider
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onConfirm={(res) => {
          getIdentityProviders().then(() => setActiveIdP(res));
        }}
      />
      <EditProvider
        visible={editVisible}
        data={{ ...editForm, ...editForm?.provider }}
        onCancel={() => setEditVisible(false)}
        onConfirm={handleEditProvider}
      />
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
