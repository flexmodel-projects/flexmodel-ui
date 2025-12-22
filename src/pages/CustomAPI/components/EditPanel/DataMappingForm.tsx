import React, {useEffect, useMemo} from "react";
import {Card, Divider, Form, Space, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {ApiMeta, DataMappingConfig, DataMappingIOConfig,} from "@/types/api-management";
import '@/components/json-schema-editor/index.css';
import JsonSchemaEditor from '@/components/json-schema-editor';

type IOType = "input" | "output";

interface DataMappingProps {
  data: ApiMeta;
  onChange: (meta: ApiMeta) => void;
}

const getSchemaText = (schema?: Record<string, any>) => {
  if (!schema) return "";
  try {
    return JSON.stringify(schema, null, 2);
  } catch {
    return "";
  }
};

const normalizeIOConfig = (
  config?: DataMappingIOConfig
): DataMappingIOConfig | undefined => {
  if (!config) return undefined;
  const schema = config.schema;

  const normalized: DataMappingIOConfig = {
    ...config,
    schema,
  };

  if (!normalized.schema) {
    delete normalized.schema;
  }

  return Object.keys(normalized).length ? normalized : undefined;
};

const buildNextMeta = (
  data: ApiMeta,
  io: IOType,
  ioConfig: DataMappingIOConfig | undefined
): ApiMeta => {
  const currentMapping: DataMappingConfig = data?.dataMapping || {};
  const nextMapping: DataMappingConfig = {
    ...currentMapping,
    [io]: normalizeIOConfig(ioConfig),
  };

  if (!nextMapping.input && !nextMapping.output) {
    return {
      ...data,
      dataMapping: undefined,
    };
  }

  return {
    ...data,
    dataMapping: nextMapping,
  };
};

const DataMappingForm: React.FC<DataMappingProps> = ({data, onChange}) => {
  const {t} = useTranslation();
  const {Title} = Typography;
  const [form] = Form.useForm();

  const dataMapping = useMemo<DataMappingConfig>(
    () => data?.dataMapping || {},
    [data?.dataMapping]
  );

  // 计算表单初始值
  const formValues = useMemo(() => ({
    inputSchema: getSchemaText(dataMapping.input?.schema),
    outputSchema: getSchemaText(dataMapping.output?.schema),
  }), [dataMapping]);

  // 当dataMapping变化时更新表单值
  useEffect(() => {
    console.log('[DataMapping] useEffect 更新表单值:', formValues);
    form.setFieldsValue(formValues);
  }, [form, formValues]);

  // 监听表单值变化
  const handleValuesChange = (changedValues: any, allValues: any) => {
      // 处理输入 Schema 变化
    if (changedValues.inputSchema !== undefined) {
      const text = allValues.inputSchema ?? "";
      const currentIO = dataMapping.input;
      if (!text.trim()) {
        const nextIO: DataMappingIOConfig = {
          ...currentIO,
          schema: undefined,
        };
        onChange(buildNextMeta(data, "input", normalizeIOConfig(nextIO)));
        return;
      }

      try {
        const parsed = JSON.parse(text);
        const nextIO: DataMappingIOConfig = {
          ...currentIO,
          schema: parsed,
        };
        onChange(buildNextMeta(data, "input", nextIO));
      } catch (error: any) {
        const message =
          error?.message || t("json_parse_error", {defaultValue: "JSON 解析失败"});
        console.error(message);
      }
    }

    // 处理输出 Schema 变化
    if (changedValues.outputSchema !== undefined) {
      const text = allValues.outputSchema ?? "";
      const currentIO = dataMapping.output;
      if (!text.trim()) {
        const nextIO: DataMappingIOConfig = {
          ...currentIO,
          schema: undefined,
        };
        onChange(buildNextMeta(data, "output", normalizeIOConfig(nextIO)));
        return;
      }

      try {
        const parsed = JSON.parse(text);
        const nextIO: DataMappingIOConfig = {
          ...currentIO,
          schema: parsed,
        };
        onChange(buildNextMeta(data, "output", nextIO));
      } catch (error: any) {
        const message =
          error?.message || t("json_parse_error", {defaultValue: "JSON 解析失败"});
        console.error(message);
      }
    }


  };

  const inputSchemaValue = Form.useWatch('inputSchema', form);
  const outputSchemaValue = Form.useWatch('outputSchema', form);

  return (
    <Card className="h-full" style={{height: "calc(100vh - 225px)", overflow: "auto"}}>
      <Form
        form={form}
        layout="vertical"
        initialValues={formValues}
        onValuesChange={handleValuesChange}
      >
        <div>
          <Title level={4}>
            {t("apis.data_mapping.input", {defaultValue: "入参设置"})}
          </Title>
          <Space orientation="vertical" size="middle" className="w-full">
            <Form.Item name="inputSchema" noStyle>
              <JsonSchemaEditor
                key="json-schema-editor-input"
                data={inputSchemaValue || formValues.inputSchema}
                onChange={(value) => {
                  console.log('[DataMapping] input JsonSchemaEditor onChange:', value);
                  form.setFieldValue('inputSchema', value);
                }}
                lang="zh_CN"
                showEditor={false}
                isMock={false}
              />
            </Form.Item>

          </Space>
        </div>

        <Divider/>

        <div>
          <Title level={4}>
            {t("apis.data_mapping.output")}
          </Title>
          <Space orientation="vertical" size="middle" className="w-full">
            <Form.Item name="outputSchema" noStyle>
              <JsonSchemaEditor
                key="json-schema-editor-output"
                data={outputSchemaValue || formValues.outputSchema}
                onChange={(value) => {
                  console.log('[DataMapping] output JsonSchemaEditor onChange:', value);
                  form.setFieldValue('outputSchema', value);
                }}
                lang="zh_CN"
                showEditor={false}
                isMock={false}
              />
            </Form.Item>

          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default DataMappingForm;


