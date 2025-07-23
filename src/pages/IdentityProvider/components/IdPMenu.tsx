import React from "react";
import {Button, Divider, Dropdown, Menu, Spin} from "antd";
import {MoreOutlined, PlusOutlined} from "@ant-design/icons";
import type {IdentityProvider} from "../data";

interface IdPMenuProps {
  idPList: IdentityProvider[];
  activeIdP: IdentityProvider | null;
  idPLoading: boolean;
  setActiveIdP: (idp: IdentityProvider) => void;
  setDeleteVisible: (visible: boolean) => void;
  setDrawerVisible: (visible: boolean) => void;
  t: (key: string) => string;
}

const IdPMenu: React.FC<IdPMenuProps> = ({ idPList, activeIdP, idPLoading, setActiveIdP, setDeleteVisible, setDrawerVisible, t }) => (
  <div
    className="border-r border-[#f5f5f5] dark:border-[#23232a]"
    style={{ width: "20%", padding: "10px 10px 0px 0px" }}
  >
    <div
      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
    >
      <span style={{ fontWeight: 600, fontSize: "16px" }}>{t("idp_management")}</span>
    </div>
    <Divider />
    <Spin spinning={idPLoading}>
      <Menu
        mode="inline"
        selectedKeys={activeIdP ? [activeIdP.name] : []}
        style={{ width: "100%" }}
        onClick={({ key }) => {
          const found = idPList.find((item) => item.name === key);
          if (found) setActiveIdP(found);
        }}
      >
        {idPList.map((item) => (
          <Menu.Item key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{item.name}</span>
            {item.type !== "system" && (
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
            )}
          </Menu.Item>
        ))}
      </Menu>
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
);

export default IdPMenu;
