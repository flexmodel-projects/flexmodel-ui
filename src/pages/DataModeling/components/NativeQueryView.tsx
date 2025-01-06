import TextArea from "antd/es/input/TextArea";
import {Button, Form, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {executeNativeQuery} from "../../../api/datasource.ts";

interface NativeQueryViewProps {
  datasource: string;
  model: any;
}

const NativeQueryView = ({datasource, model}: NativeQueryViewProps) => {
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
    const first = res?.result[0] || {};
    const cols = [];
    for (const key in first) {
      cols.push({
        key: key,
        title: key,
        dataIndex: key,
        width: 200,
        ellipsis: true,
        render: (text: any) => {
          return text + '';
        }
      })
    }
    console.log(cols);
    setColumns(cols);
    setExecResult(res);
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
            <Button type="primary">Save</Button>
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
