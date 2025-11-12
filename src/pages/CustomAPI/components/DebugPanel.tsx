import React from "react";
import {Button, Flex, Input, Select, Space, Typography} from "antd";

const {TextArea} = Input;

interface MethodOption {
  value: string;
  label: string;
}

interface DebugPanelProps {
  method: string;
  path: string;
  headers: string;
  body: string;
  response: string;
  responseStatus: string;
  loading: boolean;
  methodOptions: MethodOption[];
  apiRootPath?: string;
  onMethodChange: (value: string) => void;
  onPathChange: (value: string) => void;
  onHeadersChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onSend: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  method,
  path,
  headers,
  body,
  response,
  responseStatus,
  loading,
  methodOptions,
  apiRootPath,
  onMethodChange,
  onPathChange,
  onHeadersChange,
  onBodyChange,
  onSend,
}) => {
  const shouldShowRequestBody = !["GET", "HEAD"].includes(
    method.toUpperCase()
  );

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        width: "100%",
        flex: 1,
        display: "flex",
        minHeight: 0,
      }}
    >
      <Flex gap="small" align="center" wrap>
        <Select
          value={method}
          onChange={onMethodChange}
          options={methodOptions}
          style={{minWidth: 100}}
        />
        <Input
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          className="flex-1"
          prefix={<span>{apiRootPath}</span>}
          placeholder="/example/path"
        />
        <Button type="primary" onClick={onSend} loading={loading}>
          调试执行
        </Button>
      </Flex>

      <Space direction="vertical" size="small" style={{width: "100%"}}>
        <Typography.Text strong>请求头（JSON）</Typography.Text>
        <TextArea
          rows={4}
          value={headers}
          onChange={(e) => onHeadersChange(e.target.value)}
          placeholder='{"Authorization": "Bearer xxx"}'
        />
      </Space>

      {shouldShowRequestBody && (
        <Space direction="vertical" size="small" style={{width: "100%"}}>
          <Typography.Text strong>请求体</Typography.Text>
          <TextArea
            rows={6}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </Space>
      )}

      <Space
        direction="vertical"
        size="small"
        style={{width: "100%", flex: 1, display: "flex", minHeight: 0}}
      >
        <Typography.Text strong>
          响应{responseStatus ? `（${responseStatus}）` : ""}
        </Typography.Text>
        <TextArea
          value={response}
          readOnly
          autoSize={{minRows: 10}}
          placeholder="响应内容将展示在此处"
        />
      </Space>
    </Space>
  );
};

export default DebugPanel;

