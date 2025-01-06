import TextArea from "antd/es/input/TextArea";
import {Button, Form, notification, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {executeNativeQuery} from "../../../api/datasource.ts";
import type {NativeQueryModel} from "../data";
import {modifyModel} from "../../../api/model.ts";
import {useTranslation} from "react-i18next";

interface NativeQueryViewProps {
  datasource: string;
  model: any;
  onConfirm?: (model: NativeQueryModel) => void;
}

const NativeQueryView = ({datasource, model, onConfirm}: NativeQueryViewProps) => {
  const {t} = useTranslation();

  const [form] = Form.useForm();
  const [execResult, setExecResult]: any = useState({});
  const [columns, setColumns]: any = useState([{
    key: 'id'
  }]);

  useEffect(() => {
    if (model) {
      form.setFieldsValue(model);
    }
  }, [form, model]);

  const handleNativeQueryExecute = async () => {
    const res: {
      result: [],
      time: number
    } = await executeNativeQuery(datasource, {statement: form.getFieldValue('statement'), parameters: {}});
    const result: any[] = res?.result || [];
    const first = result.length ? result[0] : {};
    const cols = [];
    for (const key in first) {
      cols.push({
        key: key,
        title: key,
        dataIndex: key,
        width: 100,
        ellipsis: true,
        render: (text: any) => {
          return text + '';
        }
      })
    }
    setColumns(cols);
    setExecResult(res);
  }

  const handleNativeQuerySave = async () => {
    await modifyModel(datasource, {
      name: model.name,
      statement: form.getFieldValue('statement'),
      type: 'native_query'
    });
    notification.success({message: t('form_save_success')});
    if (onConfirm) {
      onConfirm({
        name: model.name,
        fields: [],
        statement: form.getFieldValue('statement'),
        type: 'native_query'
      });
    }
  }

  return (
    <>
      <Form
        form={form}
        initialValues={model}
        layout="vertical"
      >
        <Form.Item name="statement">
          <TextArea rows={4} placeholder="Execute a native queries, using ${xxx} placeholder processing"/>
        </Form.Item>
        <Form.Item>
          <Space align="end" style={{float: "right"}}>
            Time: {execResult?.time} ms
            <Button type="default" onClick={handleNativeQueryExecute}>Execute</Button>
            <Button type="primary" onClick={handleNativeQuerySave}>Save</Button>
          </Space>
        </Form.Item>
      </Form>
      <div>
        <Table
          key="id"
          virtual
          scroll={{y: 220}}
          size="small"
          pagination={false}
          columns={columns}
          dataSource={execResult?.result}
        />
        <div>Total: {execResult?.result?.length}</div>
      </div>
    </>
  );
};

export default NativeQueryView;
