import React, { useState } from "react";
import { ApiMeta } from "@/types/api-management";
import { GraphQLEditorModal } from "@/components/common";
import ScriptEditorModal from "@/components/common/ScriptEditorModal";
import { Button, Card, Tooltip, Typography } from "antd";
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
    <Card
      className="h-full"
      style={{ height: 'calc(100vh - 200px)', overflow: 'scroll' }}
    >
        <div style={{ marginBottom: '20px' }}>
          <Typography.Text strong>{t("apis.execution.pre_script")}</Typography.Text>
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <TextArea
              readOnly
              size="large"
              rows={3}
              value={localData?.execution?.preScript || ""}
              onDoubleClick={handlePreScriptOpen}
              style={{ borderRadius: '6px', border: '1px solid #d9d9d9' }}
            />
            <Tooltip title={t("apis.execution.open_pre_script_editor")}>
              <Button
                type="text"
                icon={<CodeOutlined />}
                onClick={handlePreScriptOpen}
                style={{ position: 'absolute', top: 8, right: 8, padding: '4px 12px', borderRadius: '4px' }}
              />
            </Tooltip>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Typography.Text strong>{t("apis.execution.graphql_query")}</Typography.Text>
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <TextArea
              readOnly
              size="large"
              rows={3}
              value={localData?.execution?.query || ""}
              placeholder={t("apis.graphql.placeholder")}
              onDoubleClick={handleGqlOpen}
              style={{ borderRadius: '6px', border: '1px solid #d9d9d9' }}
            />
            <Tooltip title={t("apis.graphql.open_editor")}>
              <Button
                type="text"
                icon={<CodeOutlined />}
                onClick={handleGqlOpen}
                style={{ position: 'absolute', top: 8, right: 8, padding: '4px 12px', borderRadius: '4px' }}
              />
            </Tooltip>
          </div>
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
          title={t("apis.execution.pre_script_editor")}
          description={t("apis.execution.pre_script_description")}
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
          title={t("apis.execution.post_script_editor")}
          description={t("apis.execution.post_script_description")}
        />
        <div style={{ marginBottom: '20px' }}>
          <Typography.Text strong>{t("apis.execution.post_script")}</Typography.Text>
          <div style={{ position: 'relative', marginTop: '8px' }}>
            <TextArea
              readOnly
              size="large"
              rows={3}
              value={localData?.execution?.postScript || ""}
              onDoubleClick={handlePostScriptOpen}
              style={{ borderRadius: '6px', border: '1px solid #d9d9d9' }}
            />
            <Tooltip title={t("apis.execution.open_post_script_editor")}>
              <Button
                type="text"
                icon={<CodeOutlined />}
                onClick={handlePostScriptOpen}
                style={{ position: 'absolute', top: 8, right: 8, padding: '4px 12px', borderRadius: '4px' }}
              />
            </Tooltip>
          </div>
        </div>
    </Card>
  );
};
export default ExecutionForm;