import React, {useMemo} from "react";
import {ApiDefinition} from "@/types/api-management";
import {Button, Flex, Input, Select, Space, Switch, Tabs, TabsProps} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import ExecuteConfig from "./ExecuteConfig";
import Authorization from "./Authorization";

interface MethodOption {
  value: string;
  label: string;
}

interface EditPanelProps {
  editForm: ApiDefinition | null;
  methodOptions: MethodOption[];
  apiRootPath?: string;
  saveLabel: string;
  executeConfigLabel: string;
  authorizationLabel: string;
  onSave: () => void;
  onMethodChange: (value: string) => void;
  onPathChange: (value: string) => void;
  onToggleEnabled: (value: boolean) => void;
  onExecuteConfigChange: (data: any) => void;
  onAuthorizationChange: (data: any) => void;
}

const EditPanel: React.FC<EditPanelProps> = ({
  editForm,
  methodOptions,
  apiRootPath,
  saveLabel,
  executeConfigLabel,
  authorizationLabel,
  onSave,
  onMethodChange,
  onPathChange,
  onToggleEnabled,
  onExecuteConfigChange,
  onAuthorizationChange,
}) => {
  const editTabItems: TabsProps["items"] = useMemo(
    () => [
      {
        key: "execute_config",
        label: executeConfigLabel,
        className: "h-full",
        children: (
          <ExecuteConfig
            data={editForm?.meta || {}}
            onChange={onExecuteConfigChange}
          />
        ),
      },
      {
        key: "authorization",
        label: authorizationLabel,
        className: "h-full",
        children: (
          <Authorization
            data={editForm?.meta || {}}
            onChange={onAuthorizationChange}
          />
        ),
      },
    ],
    [
      authorizationLabel,
      editForm?.meta,
      executeConfigLabel,
      onAuthorizationChange,
      onExecuteConfigChange,
    ]
  );

  return (
    <>
      <Space direction="vertical" size="small" className="mb-2">
        <Flex gap="small" justify="flex-start" align="center" wrap>
          <Input
            addonBefore={
              <Select
                value={editForm?.method}
                onChange={onMethodChange}
                options={methodOptions}
                style={{minWidth: 80}}
              />
            }
            prefix={<span>{apiRootPath}</span>}
            className="flex-1"
            value={editForm?.path}
            onChange={(e) => onPathChange(e?.target?.value)}
          />
          <Button type="primary" onClick={onSave} icon={<SaveOutlined/>}>
            {saveLabel}
          </Button>
          <Switch
            checked={!!editForm?.enabled}
            onChange={onToggleEnabled}
          />
        </Flex>
      </Space>
      <Tabs
        defaultActiveKey="execute_config"
        items={editTabItems}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      />
    </>
  );
};

export default EditPanel;

