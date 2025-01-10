import React, {useEffect, useState} from "react";
import {Button, Form, Input, Modal, notification, Space, Table,} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useTranslation} from "react-i18next";
import {executeNativeQuery} from "../../../api/datasource.ts";
import {modifyModel} from "../../../api/model.ts";
import type {NativeQueryModel} from "../data";

interface NativeQueryViewProps {
  datasource: string;
  model: Partial<NativeQueryModel>;
  onConfirm: (model: NativeQueryModel) => void;
}

const NativeQueryView: React.FC<NativeQueryViewProps> = ({datasource, model, onConfirm,}) => {
  const {t} = useTranslation();

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
    }
  }, [model, form]);

  const extractParameters = (text: string): string[] =>
    [...new Set([...text.matchAll(/\${(.*?)}/g)].map(match => match[1]))];

  const handleNativeQueryExecute = async () => {
    const statement = form.getFieldValue("statement");
    const extractedParams = extractParameters(statement);

    if (extractedParams.length) {
      setParams(extractedParams);
      setParamsDialogVisible(true);
    } else {
      await executeQuery();
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
      console.error(error);
      notification.error({message: t("query_execution_failed")});
    }
  };

  const handleNativeQuerySave = async () => {
    try {
      const updatedModel = await modifyModel(datasource, {
        name: model.name as string,
        statement: form.getFieldValue("statement"),
        type: "native_query",
      });

      notification.success({message: t("form_save_success")});
      onConfirm(updatedModel);
    } catch (error) {
      console.error(error);
      notification.error({message: t("form_save_failed")});
    }
  };

  return (
    <>
      <Form form={form} initialValues={model} layout="vertical">
        <Form.Item name="statement">
          <TextArea
            rows={4}
            placeholder={t("execute_query_placeholder")}
          />
        </Form.Item>
        <Form.Item>
          <Space align="end" style={{float: "right"}}>
            <div>time_taken: {execResult.time}ms; total_results: {execResult?.result?.length}</div>
            <Button type="default" onClick={handleNativeQueryExecute}>
              {t("execute")}
            </Button>
            <Button type="primary" onClick={handleNativeQuerySave}>
              {t("save")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        size="small"
        columns={columns}
        dataSource={execResult.result}
        rowKey="id"
      />
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
              <Input/>
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default NativeQueryView;
