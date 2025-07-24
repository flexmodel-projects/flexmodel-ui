import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, notification, Space, Table} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useTranslation} from "react-i18next";
import {executeNativeQuery} from "../../../services/datasource.ts";
import type {NativeQueryModel} from "@/types/data-modeling";

interface NativeQueryViewProps {
  datasource: string;
  model?: Partial<NativeQueryModel>;
  onConfirm: (model: NativeQueryModel) => void;
}

const NativeQueryView: React.FC<NativeQueryViewProps> = ({ datasource, model, onConfirm }) => {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [paramsForm] = Form.useForm();

  const [execResult, setExecResult] = useState<{ result: any[]; time: number }>({
    result: [],
    time: 0,
  });
  const [columns, setColumns] = useState<any[]>([]);
  const [paramsDialogVisible, setParamsDialogVisible] = useState(false);
  const [params, setParams] = useState<string[]>([]);

  useEffect(() => {
    if (model) {
      form.setFieldsValue(model);
      resetExecutionState();
    }
  }, [model, form]);

  const resetExecutionState = () => {
    setColumns([]);
    setExecResult({
      result: [],
      time: 0,
    });
  };

  const extractParameters = (text: string): string[] => {
    return [...new Set([...text.matchAll(/\${(.*?)}/g)].map((match) => match[1]))];
  };

  const handleNativeQueryExecute = async () => {
    try {
      await form.validateFields();
      const statement = form.getFieldValue("statement");
      const extractedParams = extractParameters(statement);

      if (extractedParams.length > 0) {
        setParams(extractedParams);
        setParamsDialogVisible(true);
      } else {
        await executeQuery();
      }
    } catch (error) {
      console.error("Validation failed", error);
    }
  };

  const executeQuery = async () => {
    try {
      const res = await executeNativeQuery(datasource, {
        statement: form.getFieldValue("statement"),
        parameters: paramsForm.getFieldsValue(),
      });

      setExecResult(res);
      setColumns(
        res.result.length
          ? Object.keys(res.result[0]).map((key) => ({
            key,
            title: key,
            dataIndex: key,
            width: 100,
            ellipsis: true,
            render: (text: any) => `${text}`,
          }))
          : []
      );
    } catch (error) {
      console.error("Query execution failed", error);
      notification.error({ message: t("query_execution_failed") });
    }
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      onConfirm({
        name: form.getFieldValue("name"),
        statement: form.getFieldValue("statement"),
        type: "NATIVE_QUERY",
      });
    } catch (error) {
      console.error("Validation failed", error);
    }
  };

  return (
    <>
      <Form form={form} initialValues={model} layout="vertical">
        <Form.Item name="name" label={t("name")} rules={[{ required: true }]}>
          <Input disabled={!!model} />
        </Form.Item>
        <Form.Item name="statement" label={t("statement")} rules={[{ required: true }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Space align="end" style={{ float: "right" }}>
            <div>
              {t("time_taken")}: {execResult.time}ms; {t("total_results")}: {execResult.result.length}
            </div>
            <Button type="default" onClick={handleNativeQueryExecute}>
              {t("execute")}
            </Button>
            <Button type="primary" onClick={handleSave}>
              {t("save")}
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table size="small" columns={columns} dataSource={execResult.result} rowKey="id" />

      <Modal
        title={t("parameters")}
        open={paramsDialogVisible}
        onOk={async () => {
          await executeQuery();
          setParamsDialogVisible(false);
        }}
        onCancel={() => setParamsDialogVisible(false)}
      >
        <Form form={paramsForm} layout="vertical">
          {params.map((param) => (
            <Form.Item key={param} name={param} label={param}>
              <Input />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default NativeQueryView;
