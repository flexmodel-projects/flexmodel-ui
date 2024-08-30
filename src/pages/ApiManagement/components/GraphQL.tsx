import React from 'react';
import {Card, Form, Input, Select, Switch} from 'antd';
import {GraphiQL} from "graphiql";
import 'graphiql/graphiql.css';
import {graphqlExecute} from "../../../api/api-management.ts";

const { Option } = Select;
const BASE_URI = '/api';  // Replace with actual base URI if different

const GraphQL: React.FC = () => {
  const [form] = Form.useForm();

  // Example options for Identifier Provider
  const idPs = [
    { name: 'Provider1' },
    { name: 'Provider2' },
  ];


  return (
    <Card>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        requiredMark={false}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="URI"
          name="path"
          rules={[{ required: true, message: 'Please input the URI!' }]}
        >
          <Input
            addonBefore={<div>{`${BASE_URI}/v1`}</div>}
            addonAfter={
              <Select defaultValue="GET" style={{ width: 100 }} disabled>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            }
          />
        </Form.Item>

        <Form.Item
          label="Auth"
          name="auth"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Identifier Provider"
          name="identityProvider"
          rules={[{ required: true, message: 'Please select an identifier provider!' }]}
        >
          <Select>
            {idPs.map((item) => (
              <Option key={item.name} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <div style={{ height: '100%' }}>
        <GraphiQL fetcher={graphqlExecute} />
      </div>
    </Card>
  );
};

export default GraphQL;
