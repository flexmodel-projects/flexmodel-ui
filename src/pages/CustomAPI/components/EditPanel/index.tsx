import React, {useMemo} from "react";
import {ApiDefinition} from "@/types/api-management";
import {Button, Flex, Input, Select, Space, Switch, Tabs, TabsProps} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import ExecutionForm from "./ExecutionForm.tsx";
import AuthorizationForm from "./AuthorizationForm";
import DataMappingForm from "./DataMappingForm.tsx";

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
  dataMappingLabel: string;
  onSave: () => void;
  onMethodChange: (value: string) => void;
  onPathChange: (value: string) => void;
  onToggleEnabled: (value: boolean) => void;
  onExecuteConfigChange: (data: any) => void;
  onAuthorizationChange: (data: any) => void;
  onDataMappingChange: (data: any) => void;
}

const EditPanel: React.FC<EditPanelProps> = ({
                                               editForm,
                                               methodOptions,
                                               apiRootPath,
                                               saveLabel,
                                               executeConfigLabel,
                                               authorizationLabel,
                                               dataMappingLabel,
                                               onSave,
                                               onMethodChange,
                                               onPathChange,
                                               onToggleEnabled,
                                               onExecuteConfigChange,
                                               onAuthorizationChange,
                                               onDataMappingChange,
                                             }) => {
  const editTabItems: TabsProps["items"] = useMemo(
    () => [
      {
        key: "execution_config",
        label: executeConfigLabel,
        className: "h-full",
        children: (
          <ExecutionForm
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
          <AuthorizationForm
            data={editForm?.meta || {}}
            onChange={onAuthorizationChange}
          />
        ),
      },
      {
        key: "data_mapping",
        label: dataMappingLabel,
        className: "h-full",
        children: (
          <DataMappingForm
            data={editForm?.meta || {}}
            onChange={onDataMappingChange}
          />
        ),
      },
    ],
    [
      authorizationLabel,
      dataMappingLabel,
      editForm?.meta,
      executeConfigLabel,
      onAuthorizationChange,
      onDataMappingChange,
      onExecuteConfigChange,
    ]
  );

  return (
    <>
      <Space direction="vertical" size="small" className="mb-2">
        <Flex gap="small" align="center" wrap>
          <Select
            value={editForm?.method}
            onChange={onMethodChange}
            options={methodOptions}
            style={{minWidth: 80}}
          />
          <Input
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
        defaultActiveKey="execution_config"
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

