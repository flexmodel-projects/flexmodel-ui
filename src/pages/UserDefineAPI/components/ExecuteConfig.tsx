import React, {useCallback, useRef, useState} from "react";
import {Card, Form} from "antd";
import {useTranslation} from "react-i18next";
import {ApiMeta} from "@/types/api-management";

interface ExecuteConfigProps {
  data: ApiMeta;
  onChange: (data: ApiMeta) => void;
}

const ExecuteConfig: React.FC<ExecuteConfigProps> = ({ data, onChange }: ExecuteConfigProps) => {
  const [formData, setFormData] = useState<ApiMeta>(data);
  const [form] = Form.useForm();
  const prevDataRef = useRef<ApiMeta>(data);

  const { t } = useTranslation();


  // 数据变化时通知父组件 - 使用useCallback避免无限循环
  const handleDataChange = useCallback(
    (newData: ApiMeta) => {
      const processedData = {
        auth: newData?.auth,
        identityProvider: newData?.auth ? newData.identityProvider : undefined,
        rateLimitingEnabled: newData?.rateLimitingEnabled,
        intervalInSeconds: newData?.rateLimitingEnabled
          ? newData.intervalInSeconds
          : undefined,
        maxRequestCount: newData?.rateLimitingEnabled
          ? newData.maxRequestCount
          : undefined,
        execution: newData?.execution,
      };

      // 避免重复调用onChange
      if (
        JSON.stringify(processedData) !== JSON.stringify(prevDataRef.current)
      ) {
        onChange(processedData);
      }
    },
    [onChange]
  );

  // 表单值变化处理
  const handleFormValuesChange = useCallback(
    (changedValues: Partial<ApiMeta>) => {
      const newFormData = { ...formData, ...changedValues };
      setFormData(newFormData);
      handleDataChange(newFormData);
    },
    [formData, handleDataChange]
  );

  return (
    <Card className="h-full">
      <Form
        form={form}
        initialValues={data}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onValuesChange={handleFormValuesChange}
      >
        {JSON.stringify(data)}
      </Form>

    </Card>
  );
};

export default ExecuteConfig;
