import React, {useCallback, useEffect, useRef, useState} from "react";
import {Card, Form, InputNumber, Select, Switch} from "antd";
import {SelectProps} from "rc-select/lib/Select";
import {getIdentityProviders} from "@/services/identity-provider.ts";
import {useTranslation} from "react-i18next";
import {ApiMeta} from "@/types/api-management";

interface AuthProps {
  data: ApiMeta;
  onChange: (data: ApiMeta) => void;
}

const Authorization: React.FC<AuthProps> = ({ data, onChange }: AuthProps) => {
  const [formData, setFormData] = useState<ApiMeta>(data);
  const [form] = Form.useForm();
  const prevDataRef = useRef<ApiMeta>(data);

  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const { t } = useTranslation();

  // 获取身份源列表
  useEffect(() => {
    getIdentityProviders().then((res) =>
      setOptions(
        res.map((d: { name: string }) => ({
          value: d.name,
          label: d.name,
        }))
      )
    );
  }, []);

  // 表单数据回填 - 只在data真正变化时执行
  useEffect(() => {
    // 深度比较，避免不必要的更新
    const isDataChanged =
      JSON.stringify(data) !== JSON.stringify(prevDataRef.current);

    if (isDataChanged && data && Object.keys(data).length > 0) {
      form.setFieldsValue(data);
      setFormData(data);
      prevDataRef.current = data;
    }
  }, [data, form]);

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
        <Form.Item name="auth" label={t("api_auth")}>
          <Switch />
        </Form.Item>
        {formData?.auth && (
          <Form.Item
            name="identityProvider"
            label={t("identity_provider")}
            required
          >
            <Select options={options} placeholder={t("select_a_provider")} />
          </Form.Item>
        )}
        <Form.Item name="rateLimitingEnabled" label={t("api_rate_limiting")}>
          <Switch />
        </Form.Item>
        {formData?.rateLimitingEnabled && (
          <>
            <Form.Item
              name="intervalInSeconds"
              label={t("interval_in_seconds")}
              required
            >
              <InputNumber defaultValue={60} addonAfter={t("sec")} />
            </Form.Item>
            <Form.Item
              name="maxRequestCount"
              label={t("max_request_count")}
              required
            >
              <InputNumber defaultValue={500} addonAfter={t("times")} />
            </Form.Item>
          </>
        )}
      </Form>
    </Card>
  );
};

export default Authorization;
