import React, { useState } from "react";
import {ApiMeta} from "@/types/api-management";
import {GraphQLEditorModal} from "@/components/common";
import ScriptEditorModal from "@/components/common/ScriptEditorModal";
import { Button, Tooltip, Typography } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

interface ExecuteConfigProps {
  data: ApiMeta;
  onChange: (data: ApiMeta) => void;
}

const ExecutionForm: React.FC<ExecuteConfigProps> = ({ data, onChange }: ExecuteConfigProps) => {
  const { t } = useTranslation();
  const [gqlEditorVisible, setGqlEditorVisible] = useState(false);
  const [preScriptEditorVisible, setPreScriptEditorVisible] = useState(false);
  const [postScriptEditorVisible, setPostScriptEditorVisible] = useState(false);
  const [localData, setLocalData] = useState<ApiMeta>(data);

  const handleGqlOpen = () => {
    setGqlEditorVisible(true);
  };

  const handleGqlClose = () => {
    setGqlEditorVisible(false);
  };

  const handlePreScriptOpen = () => {
    setPreScriptEditorVisible(true);
  };

  const handlePostScriptOpen = () => {
    setPostScriptEditorVisible(true);
  };

  const handleEditorChange = (r: any) => {
    const newData = { ...localData, execution: r };
    setLocalData(newData);
    onChange(newData as ApiMeta);
  };

  return (
    <div>
      <Typography.Text strong>前置脚本</Typography.Text>
      <div style={{ position: 'relative' }}>
        <TextArea
          readOnly
          size="small"
          rows={4}
          value={localData?.execution?.preScript || ""}
          onDoubleClick={handlePreScriptOpen}
        />
        <Tooltip title="打开前置脚本编辑器">
          <Button
            type="text"
            icon={<CodeOutlined />}
            onClick={handlePreScriptOpen}
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        </Tooltip>
      </div>
      <Typography.Text strong>GraphQL 查询</Typography.Text>
      <div style={{ position: 'relative' }}>
        <TextArea
          readOnly
          size="small"
          rows={4}
          value={localData?.execution?.query || ""}
          placeholder={t("apis.graphql.placeholder")}
          onDoubleClick={handleGqlOpen}
        />
        <Tooltip title={t("apis.graphql.open_editor")}>
          <Button
            type="text"
            icon={<CodeOutlined />}
            onClick={handleGqlOpen}
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        </Tooltip>
      </div>
      <GraphQLEditorModal
        visible={gqlEditorVisible}
        value={localData.execution || { query: "" }}
        onChange={handleEditorChange}
        onClose={handleGqlClose}
      />
      <ScriptEditorModal
        visible={preScriptEditorVisible}
        value={localData?.execution?.preScript || ""}
        onChange={(value: string) => {
          const newData = { ...localData, execution: { ...localData.execution, preScript: value, query: localData.execution?.query || "" } };
          setLocalData(newData);
          onChange(newData as ApiMeta);
        }}
        onClose={() => setPreScriptEditorVisible(false)}
        title="前置脚本编辑器"
        description="请输入前置脚本内容，该脚本将在GraphQL查询执行前运行。"
      />
      <ScriptEditorModal
        visible={postScriptEditorVisible}
        value={localData?.execution?.postScript || ""}
        onChange={(value: string) => {
          const newData = { ...localData, execution: { ...localData.execution, postScript: value, query: localData.execution?.query || "" } };
          setLocalData(newData);
          onChange(newData as ApiMeta);
        }}
        onClose={() => setPostScriptEditorVisible(false)}
        title="后置脚本编辑器"
        description="请输入后置脚本内容，该脚本将在GraphQL查询执行后运行。"
      />
      <Typography.Text strong>后置脚本</Typography.Text>
      <div style={{ position: 'relative' }}>
        <TextArea
          readOnly
          size="small"
          rows={4}
          value={localData?.execution?.postScript || ""}
          onDoubleClick={handlePostScriptOpen}
        />
        <Tooltip title="打开后置脚本编辑器">
          <Button
            type="text"
            icon={<CodeOutlined />}
            onClick={handlePostScriptOpen}
            style={{ position: 'absolute', top: 8, right: 8 }}
          />
        </Tooltip>
      </div>
    </div>
  );
};
export default ExecutionForm;