import React from "react";
import {Button, Divider, Dropdown, Menu, Spin, Typography} from "antd";
import {KeyOutlined, MoreOutlined, PlusOutlined, SafetyCertificateOutlined, UserOutlined} from "@ant-design/icons";
// 导入Tree组件
import Tree from "@/components/explore/explore/Tree.jsx";
// 导入Tree样式
import "@/components/explore/styles/explore.scss";
import type {IdentityProvider} from "@/types/identity-provider";
import styles from "@/pages/IdentityProvider/index.module.scss";

const { Title } = Typography;

interface IdPMenuProps {
  idPList: IdentityProvider[];
  activeIdP: IdentityProvider | null;
  idPLoading: boolean;
  setActiveIdP: (idp: IdentityProvider) => void;
  setDeleteVisible: (visible: boolean) => void;
  setDrawerVisible: (visible: boolean) => void;
  t: (key: string) => string;
}

const IdPMenu: React.FC<IdPMenuProps> = ({
  idPList,
  activeIdP,
  idPLoading,
  setActiveIdP,
  setDeleteVisible,
  setDrawerVisible,
  t,
}) => {
  // 将身份提供商列表转换为Tree组件需要的数据结构
  const treeData = {
    children: idPList.map((idp) => ({
      type: 'file' as const,
      filename: idp.name,
      path: idp.name,
      identityProvider: idp, // 保存原始身份提供商对象
    }))
  };

  // 当前选中的身份提供商
  const selectedItem = {
    path: activeIdP?.name || ''
  };

  // 自定义图标渲染函数
  const renderIcon = (item: any, nodeType: any) => {
    if (nodeType === 'file' && item.identityProvider) {
      const providerType = item.identityProvider.provider?.type || item.identityProvider.type;

      // 根据身份提供商类型显示不同图标
      switch (providerType?.toLowerCase()) {
        case 'oauth2':
        case 'oidc':
          return <SafetyCertificateOutlined style={{ color: '#1890ff' }} />;
        case 'saml':
          return <KeyOutlined style={{ color: '#52c41a' }} />;
        case 'system':
          return <UserOutlined style={{ color: '#faad14' }} />;
        default:
          return <UserOutlined style={{ color: '#666' }} />;
      }
    }
    return <div />;
  };

  // 更多按钮渲染函数
  const renderMore = (item: any) => {
    if (item.identityProvider && item.identityProvider.type !== "system") {
      return (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                className="text-red"
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                  setActiveIdP(item.identityProvider);
                  setDeleteVisible(true);
                }}
              >
                <span style={{ color: "red" }}>{t("delete")}</span>
              </Menu.Item>
            </Menu>
          }
          trigger={["hover"]}
          placement="bottomRight"
        >
          <MoreOutlined
            className="cursor-pointer opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            style={{ marginLeft: '8px' }}
          />
        </Dropdown>
      );
    }
    return null;
  };

  return (
    <div className={`${styles["idp-menu-wrapper"]}`} style={{ minWidth: 200 }}>
      <Title level={5} style={{ margin: 0, marginBottom: "16px" }}>
        {t('idp_management')}
      </Title>
      <Divider style={{ margin: "16px 0" }} />
      <Spin spinning={idPLoading}>
        <Tree
          tree={treeData}
          selected={selectedItem}
          onClickItem={(item) => setActiveIdP(item.identityProvider)}
          renderIcon={renderIcon}
          renderMore={renderMore}
        />
      </Spin>
      <Divider style={{ margin: "8px 0" }} />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setDrawerVisible(true)}
        style={{ width: "100%" }}
        ghost
      >
        {t("idp_new_provider")}
      </Button>
    </div>
  );
};

export default IdPMenu;
