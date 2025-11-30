import React, {useEffect, useMemo} from "react";
import {Card, Divider, Form, Space, Switch, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {ApiMeta, DataMappingConfig, DataMappingIOConfig,} from "@/types/api-management";
import '@/components/json-schema-editor/index.css';
import JsonSchemaEditor from '@/components/json-schema-editor';
import ScriptField from "./components/ScriptField";

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
  const script = config.script?.trim();

  const normalized: DataMappingIOConfig = {
    ...config,
    schema,
    script: script ?? undefined,
  };

  if (!normalized.schema) {
    delete normalized.schema;
  }
  if (!normalized.script) {
    delete normalized.script;
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
    inputScript: dataMapping.input?.script || "",
    outputScript: dataMapping.output?.script || "",
    inputScriptEnabled: dataMapping.input?.scriptEnabled ?? false,
    outputScriptEnabled: dataMapping.output?.scriptEnabled ?? false,
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
          scriptEnabled: allValues.inputScriptEnabled ?? false,
        };
        onChange(buildNextMeta(data, "input", normalizeIOConfig(nextIO)));
        return;
      }

      try {
        const parsed = JSON.parse(text);
        const nextIO: DataMappingIOConfig = {
          ...currentIO,
          schema: parsed,
          scriptEnabled: allValues.inputScriptEnabled ?? false,
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
          scriptEnabled: allValues.outputScriptEnabled ?? false,
        };
        onChange(buildNextMeta(data, "output", normalizeIOConfig(nextIO)));
        return;
      }

      try {
        const parsed = JSON.parse(text);
        const nextIO: DataMappingIOConfig = {
          ...currentIO,
          schema: parsed,
          scriptEnabled: allValues.outputScriptEnabled ?? false,
        };
        onChange(buildNextMeta(data, "output", nextIO));
      } catch (error: any) {
        const message =
          error?.message || t("json_parse_error", {defaultValue: "JSON 解析失败"});
        console.error(message);
      }
    }

    // 处理输入脚本变化
    if (changedValues.inputScript !== undefined) {
      const scriptValue = allValues.inputScript ?? "";
      const currentIO = dataMapping.input;
      const nextIO: DataMappingIOConfig = {
        ...currentIO,
        schema: currentIO?.schema,
        script: scriptValue.trim() ? scriptValue : undefined,
        scriptEnabled: allValues.inputScriptEnabled ?? false,
      };
      onChange(buildNextMeta(data, "input", nextIO));
    }

    // 处理输出脚本变化
    if (changedValues.outputScript !== undefined) {
      const scriptValue = allValues.outputScript ?? "";
      const currentIO = dataMapping.output;
      const nextIO: DataMappingIOConfig = {
        ...currentIO,
        schema: currentIO?.schema,
        script: scriptValue.trim() ? scriptValue : undefined,
        scriptEnabled: allValues.outputScriptEnabled ?? false,
      };
      onChange(buildNextMeta(data, "output", nextIO));
    }

    // 处理输入脚本开关变化
    if (changedValues.inputScriptEnabled !== undefined) {
      const enabled = allValues.inputScriptEnabled ?? false;
      const currentIO = dataMapping.input;
      const nextIO: DataMappingIOConfig = {
        ...currentIO,
        schema: currentIO?.schema,
        scriptEnabled: enabled,
        script: enabled ? (allValues.inputScript || currentIO?.script) : undefined,
      };
      onChange(buildNextMeta(data, "input", nextIO));
    }

    // 处理输出脚本开关变化
    if (changedValues.outputScriptEnabled !== undefined) {
      const enabled = allValues.outputScriptEnabled ?? false;
      const currentIO = dataMapping.output;
      const nextIO: DataMappingIOConfig = {
        ...currentIO,
        schema: currentIO?.schema,
        scriptEnabled: enabled,
        script: enabled ? (allValues.outputScript || currentIO?.script) : undefined,
      };
      onChange(buildNextMeta(data, "output", nextIO));
    }
  };

  const inputScriptEnabled = Form.useWatch('inputScriptEnabled', form);
  const outputScriptEnabled = Form.useWatch('outputScriptEnabled', form);
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
            <Form.Item name="inputScriptEnabled" label={t("apis.data_mapping.input_script_switch")}
                       valuePropName="checked">
              <Switch/>
            </Form.Item>
            {inputScriptEnabled && (
              <Form.Item
                name="inputScript"
                label={t("apis.data_mapping.input_script")}
              >
                <ScriptField/>
              </Form.Item>
            )}
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
            <Form.Item name="outputScriptEnabled" label={t("apis.data_mapping.output_script_switch")}
                       valuePropName="checked">
              <Switch/>
            </Form.Item>
            {outputScriptEnabled && (
              <Form.Item
                name="outputScript"
                label={t("apis.data_mapping.output_script")}>
                <ScriptField/>
              </Form.Item>
            )}
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default DataMappingForm;


