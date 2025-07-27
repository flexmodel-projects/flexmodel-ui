import React from "react";
import {Button, Divider, Dropdown, Menu, Spin, theme as antdTheme} from "antd";
import {MoreOutlined, PlusOutlined} from "@ant-design/icons";
import type {IdentityProvider} from "@/types/identity-provider";

interface IdPMenuProps {
  idPList: IdentityProvider[];
  activeIdP: IdentityProvider | null;
  idPLoading: boolean;
  setActiveIdP: (idp: IdentityProvider) => void;
  setDeleteVisible: (visible: boolean) => void;
  setDrawerVisible: (visible: boolean) => void;
  t: (key: string) => string;
}

const IdPMenu: React.FC<IdPMenuProps> = ({ idPList, activeIdP, idPLoading, setActiveIdP, setDeleteVisible, setDrawerVisible, t }) => {
  const { token } = antdTheme.useToken();

  return (
  <div style={{ minWidth: 200 }}>
    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 8 }}>
      <span style={{ fontWeight: 400, fontSize: "16px", fontFamily: token.fontFamily }}>{t("idp_management")}</span>
    </div>
    <Divider style={{margin: '8px 0'}} />
    <Spin spinning={idPLoading}>
      <Menu
        mode="inline"
        selectedKeys={activeIdP ? [activeIdP.name] : []}
        style={{ borderRadius: 8, flex: 1 }}
        onClick={({ key }) => {
          const found = idPList.find((item) => item.name === key);
          if (found) setActiveIdP(found);
        }}
      >
        {idPList.map((item) => (
          <Menu.Item
            key={item.name}
            style={{ display: 'flex', alignItems: 'center', borderRadius: 8, marginBottom: 2, position: 'relative', paddingRight: 32 }}
          >
            <span style={{ flex: 1 }}>{item.name}</span>
            {item.type !== "system" && (
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
                  trigger={["click"]}
                  placement="bottomRight"
                  menu={{
                    items: [
                      {
                        key: "delete",
                        label: <span style={{ color: "red" }}>Delete</span>,
                        onClick: () => {
                          setActiveIdP(item);
                          setDeleteVisible(true);
                        },
                      },
                    ],
                  }}
                >
                  <MoreOutlined style={{ cursor: "pointer" }} />
                </Dropdown>
              </span>
            )}
          </Menu.Item>
        ))}
      </Menu>
    </Spin>
    <Divider style={{margin: '8px 0'}} />
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => setDrawerVisible(true)}
      style={{width: '100%'}}
      ghost
    >
      {t("idp_new_provider")}
    </Button>
  </div>
  );
};

export default IdPMenu;
