import React, {useState} from 'react';
import {Button, Col, Drawer, Form, Input, message, Radio, Row, Space, Steps} from 'antd';
import {createDatasource, validateDatasource} from "../../../api/datasource.ts";
import MySQLConfig from "./MySQLConfig.tsx";
import SQLiteConfig from "./SQLiteConfig.tsx";
import CommonConfig from "./CommonConfig.tsx";
import DatabaseInfo from "./DatabaseInfo.tsx";
import {css} from "@emotion/css";

const {Step} = Steps;

interface FormConfig {
  dbKind: string;

  [key: string]: any;
}

const ConnectDatabaseDrawer: React.FC<{
  visible: boolean;
  onChange: (data: any) => void;
  onClose: () => void;
}> = ({visible, onChange, onClose}) => {
  const [active, setActive] = useState<number>(0);
  const [form] = Form.useForm();
  const [currentVal, setCurrentVal] = useState<any>({});

  const handlePrev = () => {
    setActive(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setActive(prev => Math.min(prev + 1, 2));
  };

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields();
      const result = await validateDatasource({name: values.name, config: {...values}});
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
      const data = {name: values.name, config: {...values}};
      const result = await validateDatasource(data);
      if (result.success) {
        const res = await createDatasource(data);
        setCurrentVal(res);
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

  const segmentTitle = css`
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
  `;

  return (
    <Drawer
      title="Connect Database"
      width="50%"
      placement="right"
      onClose={onClose}
      open={visible}
    >
      <div style={{paddingBottom: 20}}>
        <Steps current={active} size="small">
          <Step title="Select Database"/>
          <Step title="Connect Database"/>
          <Step title="Completed"/>
        </Steps>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: 'mysql_newtest',
          dbKind: 'mysql',
          url: 'jdbc:mysql://metacode.wetech.tech:3306/metacode',
          username: 'root',
          password: 'metacode@123!'
        }}
      >
        {active === 0 && (
          <Form.Item label="Please select your database to connect." name="dbKind">
            <Radio.Group name="dbKind">
              <div className={segmentTitle}>Relational</div>
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
              <div className={segmentTitle}>Document</div>
              <Radio value="mongodb">MongoDB</Radio>
              <div className={segmentTitle}>Other</div>
              <Radio value="graphql" disabled>GraphQL</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {active === 1 && (
          <>
            <Form.Item name="name" label="Connection name"
                       rules={[{required: true, message: 'Please input connection name!'}]}>
              <Input name="name"/>
            </Form.Item>
            {form.getFieldValue('dbKind') === 'mysql' && <MySQLConfig/>}
            {form.getFieldValue('dbKind') === 'sqlite' && <SQLiteConfig/>}
            {form.getFieldValue('dbKind') !== 'mysql' && form.getFieldValue('dbKind') !== 'sqlite' &&
              <CommonConfig/>}
          </>
        )}
        {active === 2 && (
          <>
            <Row>
              <Col span={24} style={{marginTop: 12, marginBottom: 12, textAlign: 'center'}}>
                <span>Connected successfully</span>
              </Col>
              <Col span={24}>
                <DatabaseInfo datasource={currentVal}/>
              </Col>
              <Col span={24} style={{textAlign: 'center'}}>
                <Button style={{marginTop: 12}} onClick={() => {
                  onClose();
                  setActive((0));
                }}>Close</Button>
              </Col>
            </Row>
          </>
        )}
        <Form.Item style={{textAlign:'end'}} wrapperCol={{offset: 8, span: 16}}>
          <Space>
            {active !== 0 && active !== 2 && (
              <Button onClick={handlePrev}>Go back</Button>
            )}
            {active === 0 && (
              <Button type="primary" onClick={handleNext}>Select Database</Button>
            )}
            {active === 1 && (
              <>
                <Button onClick={handleTestConnection}>Test Connection</Button>
                <Button type="primary" onClick={handleConnectDatabase}>Connect Database</Button>
              </>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ConnectDatabaseDrawer;
