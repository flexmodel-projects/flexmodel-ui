import {TabMenuItem} from "@/components/common/TabMenu.tsx";
import {PlayCircleOutlined, ThunderboltOutlined} from "@ant-design/icons";
import React from 'react';
import {useTranslation} from "react-i18next";
import TabPageContainer from "../../components/common/TabPageContainer.tsx";
import TriggerList from "./components/TriggerList.tsx";
import JobExecutionLogList from "./components/JobExecutionLogList.tsx";


const Schedule: React.FC = () => {

  const { t } = useTranslation();

  // 标签页配置
  const tabItems: TabMenuItem[] = [
    {
      key: "trigger",
      label: t("trigger.title"),
      element: TriggerList,
      icon: <ThunderboltOutlined />,
      path: "/schedule/trigger",
    },
    {
      key: "job_execution_log",
      label: t("job_execution_log"),
      element: JobExecutionLogList,
      icon: <PlayCircleOutlined />,
      path: "/schedule/job-execution-log",
    },
  ];

  return (
    <TabPageContainer
      items={tabItems}
      defaultActiveKey="trigger"
    />
  );
};

export default Schedule;
