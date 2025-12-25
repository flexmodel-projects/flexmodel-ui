import React, {useEffect, useMemo} from "react";
import {Card, Divider, Form} from "antd";
import {useTranslation} from "react-i18next";
import {ApiMeta, documentConfig, documentIOConfig,} from "@/types/api-management";
import '@/components/json-schema-editor/index.css';
import JsonSchemaEditor from '@/components/json-schema-editor';

type IOType = "input" | "output";

interface documentProps {
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
  config?: documentIOConfig
): documentIOConfig | undefined => {
  if (!config) return undefined;
  const schema = config.schema;

  const normalized: documentIOConfig = {
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
  ioConfig: documentIOConfig | undefined
): ApiMeta => {
  const currentMapping: documentConfig = data?.document || {};
  const nextMapping: documentConfig = {
    ...currentMapping,
    [io]: normalizeIOConfig(ioConfig),
  };

  if (!nextMapping.input && !nextMapping.output) {
    return {
      ...data,
      document: undefined,
    };
  }

  return {
    ...data,
    document: nextMapping,
  };
};

const documentForm: React.FC<documentProps> = ({data, onChange}) => {
  const {t} = useTranslation();
  const [form] = Form.useForm();

  const document = useMemo<documentConfig>(
    () => data?.document || {},
    [data?.document]
  );

  // 计算表单初始值
  const formValues = useMemo(() => ({
    inputSchema: getSchemaText(document.input?.schema),
    outputSchema: getSchemaText(document.output?.schema),
  }), [document]);

  // 当document变化时更新表单值
  useEffect(() => {
    console.log('[document] useEffect 更新表单值:', formValues);
    form.setFieldsValue(formValues);
  }, [form, formValues]);

  // 监听表单值变化
  const handleValuesChange = (changedValues: any, allValues: any) => {
      // 处理输入 Schema 变化
    if (changedValues.inputSchema !== undefined) {
      const text = allValues.inputSchema ?? "";
      const currentIO = document.input;
      if (!text.trim()) {
        const nextIO: documentIOConfig = {
          ...currentIO,
          schema: undefined,
        };
        onChange(buildNextMeta(data, "input", normalizeIOConfig(nextIO)));
        return;
      }

      try {
        const parsed = JSON.parse(text);
        const nextIO: documentIOConfig = {
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
      const currentIO = document.output;
      if (!text.trim()) {
        const nextIO: documentIOConfig = {
          ...currentIO,
          schema: undefined,
        };
        onChange(buildNextMeta(data, "output", normalizeIOConfig(nextIO)));
        return;
      }

      try {
        const parsed = JSON.parse(text);
        const nextIO: documentIOConfig = {
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
        layout="horizontal"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        initialValues={formValues}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="inputSchema" label={t("apis.document.input", {defaultValue: "入参设置"})}>
          <JsonSchemaEditor
            key="json-schema-editor-input"
            data={inputSchemaValue || formValues.inputSchema}
            onChange={(value) => {
              console.log('[document] input JsonSchemaEditor onChange:', value);
              form.setFieldValue('inputSchema', value);
            }}
            lang="zh_CN"
            showEditor={false}
            isMock={false}
          />
        </Form.Item>

        <Divider/>

        <Form.Item name="outputSchema" label={t("apis.document.output")}>
          <JsonSchemaEditor
            key="json-schema-editor-output"
            data={outputSchemaValue || formValues.outputSchema}
            onChange={(value) => {
              console.log('[document] output JsonSchemaEditor onChange:', value);
              form.setFieldValue('outputSchema', value);
            }}
            lang="zh_CN"
            showEditor={false}
            isMock={false}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default documentForm;


