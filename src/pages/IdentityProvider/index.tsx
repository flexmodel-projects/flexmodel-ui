import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Dropdown, Empty, message, Modal, Row, Spin, Tree,} from "antd";
import {MoreOutlined, PlusOutlined} from "@ant-design/icons";
import {
  deleteIdentityProvider,
  getIdentityProviders as getIdentityProvidersApi,
  updateIdentityProvider,
} from "../../api/identity-provider";
import IdPInfo from "./components/IdPInfo.tsx";
import EditProvider from "./components/EditProvider.tsx";
import CreateProvider from "./components/CreateProvider.tsx";
import {useTranslation} from "react-i18next";
import styles from "./index.module.scss";

interface IdentityProvider {
  name: string;
  provider?:
    | {
        type: string;
        issuer: string;
        clientId: string;
        clientSecret: string;
      }
    | any;
  type?: string;
  children?: IdentityProvider[];
}

const treeProps = {
  title: "name",
  key: "name",
  children: "children",
};

const IdPManagement: React.FC = () => {
  const { t } = useTranslation();
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
      });
      setEditVisible(false);
      await getIdentityProviders();
      setActiveIdP(reqData);
      message.success(t("form_save_success"));
    } catch {
      message.error(t("form_save_failed"));
    }
  };

  return (
    <>
      <Card style={{ flex: 1, width: "100%" }} className={styles.root}>
        <div style={{ display: "flex", backgroundColor: "#fff", flex: 1 }}>
          <div
            style={{
              width: "20%",
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
                {t("idp_management")}
              </span>
            </div>
            <Divider />
            <Spin spinning={idPLoading}>
              <Tree
                treeData={idPList}
                fieldNames={treeProps}
                defaultExpandAll
                selectedKeys={activeIdP ? [activeIdP.name] : []}
                onSelect={(_, { node }) => setActiveIdP(node)}
                titleRender={(nodeData: any) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "220px",
                    }}
                  >
                    <div>{nodeData.name}</div>
                    {nodeData.type !== "system" && (
                      <Dropdown
                        trigger={["click"]}
                        menu={{
                          items: [
                            {
                              key: "delete",
                              label: (
                                <span style={{ color: "red" }}>Delete</span>
                              ),
                              onClick: () => {
                                setActiveIdP(nodeData);
                                setDeleteVisible(true);
                              },
                            },
                          ],
                        }}
                      >
                        <MoreOutlined style={{ cursor: "pointer" }} />
                      </Dropdown>
                    )}
                  </div>
                )}
              />
            </Spin>
            <Divider />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerVisible(true)}
              block
              ghost
            >
              {t("idp_new_provider")}
            </Button>
          </div>
          <div style={{ width: "80%", padding: "8px 20px" }}>
            {idPList.length > 0 && activeIdP ? (
              <Row>
                <Col span={24}>
                  <Row justify="space-between">
                    <Col>{activeIdP.name}</Col>
                    <Col>
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
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Card bordered={false}>
                    <IdPInfo data={activeIdP} />
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
