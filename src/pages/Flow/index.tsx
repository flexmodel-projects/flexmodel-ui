import {TabMenuItem} from "@/components/common/TabMenu.tsx";
import FlowInstanceList from "@/pages/Flow/components/FlowInstanceList.tsx";
import FlowList from "@/pages/Flow/components/FlowList.tsx";
import {BranchesOutlined, PlayCircleOutlined} from "@ant-design/icons";
import React from 'react';
import {useTranslation} from "react-i18next";
import TabPageContainer from "../../components/common/TabPageContainer.tsx";


const Flow: React.FC = () => {

  const { t } = useTranslation();

  // 标签页配置
  const tabItems: TabMenuItem[] = [
    {
      key: "flow_mgr",
      label: t("flow_mgr"),
      element: FlowList,
      icon: <BranchesOutlined />,
      path: "/flow/mgr",
    },
    {
      key: "flow_instance",
      label: t("flow_instance"),
      element: FlowInstanceList,
      icon: <PlayCircleOutlined />,
      path: "/flow/instance",
    },
  ];

  return (
    <TabPageContainer
      items={tabItems}
      defaultActiveKey="flow_mgr"
    />
  );
};

export default Flow;
