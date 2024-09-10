import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Radio, Steps, Row, Col, message } from 'antd';
import {createDatasource, validateDatasource} from "../../../api/datasource.ts";
import MySQLConfig from "./MySQLConfig.tsx";
import SQLiteConfig from "./SQLiteConfig.tsx";
import CommonConfig from "./CommonConfig.tsx";
import DatabaseInfo from "./DatabaseInfo.tsx";

const { Step } = Steps;

interface FormConfig {
  dbKind: string;
  [key: string]: any;
}

const ConnectDatabaseDrawer: React.FC<{ visible: boolean; onChange: (data: any) => void; onClose: () => void; }> = ({ visible, onChange, onClose }) => {
  const [active, setActive] = useState<number>(0);
  const [form] = Form.useForm();

  const handlePrev = () => {
    setActive(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setActive(prev => Math.min(prev + 1, 2));
  };

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields();
      const result = await validateDatasource(values);
      if (result.success) {
        message.success(`Succeed, ping: ${result.time}ms`);
      } else {
        message.error(`Failed, error msg: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error(error)
      // Handle validation or network errors
    }
  };

  const handleConnectDatabase = async () => {
    try {
      const values = await form.validateFields();
      const result = await validateDatasource(values);
      if (result.success) {
        const res = await createDatasource(values);
        handleNext();
        onChange(res);
      } else {
        message.error(`Failed, error msg: ${result.errorMsg}`);
      }
    } catch (error) {
      console.error(error)
      // Handle validation or network errors
    }
  };

  return (
    <Drawer
      title="Connect Database"
      width="50%"
      placement="right"
      onClose={onClose}
      open={visible}
    >
      <div style={{ paddingBottom: 20 }}>
        <Steps current={active} size="small">
          <Step title="Select Database" />
          <Step title="Connect Database" />
          <Step title="Completed" />
        </Steps>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ config: { dbKind: 'mysql' } }}
      >
        {active === 0 && (
          <Form.Item label="Please select your database to connect.">
            <Radio.Group name="config.dbKind">
              <div className="segment-title">Relational</div>
              <Radio value="mysql">MySQL</Radio>
              <Radio value="mariadb">MariaDB</Radio>
              <Radio value="oracle">Oracle</Radio>
              <Radio value="sqlserver">SQL Server</Radio>
              <Radio value="postgresql">PostgreSQL</Radio>
              <Radio value="db2">DB2</Radio>
              <Radio value="sqlite">SQLite</Radio>
              <Radio value="gbase">GBase</Radio>
              <Radio value="dm">DM8</Radio>
              <Radio value="tidb">TiDB</Radio>
              <div className="segment-title">Document</div>
              <Radio value="mongodb">MongoDB</Radio>
              <div className="segment-title">Other</div>
              <Radio value="graphql" disabled>GraphQL</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {active === 1 && (
          <>
            <Form.Item name="name" label="Connection name" rules={[{ required: true, message: 'Please input connection name!' }]}>
              <Input />
            </Form.Item>
            {form.getFieldValue('config.dbKind') === 'mysql' && <MySQLConfig />}
            {form.getFieldValue('config.dbKind') === 'sqlite' && <SQLiteConfig />}
            {form.getFieldValue('config.dbKind') !== 'mysql' && form.getFieldValue('config.dbKind') !== 'sqlite' && <CommonConfig />}
          </>
        )}
        {active === 2 && (
          <>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <span>Connected successfully</span>
              </Col>
              <Col span={24}>
                <DatabaseInfo datasource={form.getFieldsValue()} />
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button style={{ marginTop: 12 }} onClick={onClose}>Close</Button>
              </Col>
            </Row>
          </>
        )}
      </Form>
      <div style={{ marginTop: 12 }}>
        {active !== 0 && active !== 2 && (
          <Button style={{ marginRight: 8 }} onClick={handlePrev}>Go back</Button>
        )}
        {active === 0 && (
          <Button type="primary" onClick={handleNext}>Select Database</Button>
        )}
        {active === 1 && (
          <>
            <Button onClick={handleTestConnection}>Test Connection</Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={handleConnectDatabase}>Connect Database</Button>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default ConnectDatabaseDrawer;
