import React, {useState} from 'react';
import {Button, Col, Drawer, Form, Input, message, Radio, Row, Space, Spin, Steps, Transfer, TransferProps} from 'antd';
import {createDatasource, getPhysicsModelNames, syncModels, validateDatasource} from "../../../services/datasource.ts";
import MySQLConfig from "./MySQLConfig.tsx";
import SQLiteConfig from "./SQLiteConfig.tsx";
import CommonConfig from "./CommonConfig.tsx";
import DatabaseInfo from "./DatabaseInfo.tsx";
import Title from "antd/lib/typography/Title";
import {useTranslation} from "react-i18next";

const {Step} = Steps;

const ConnectDatabaseDrawer: React.FC<{
  visible: boolean;
  onChange: (data: any) => void;
  onClose: () => void;
}> = ({visible, onChange, onClose}) => {
  const {t} = useTranslation();
  const [active, setActive] = useState<number>(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({});
  const [currentVal, setCurrentVal] = useState<any>({});
  const [pLoading, setPLoading] = useState<boolean>(false);
  const [physicsModelData, setPhysicsModelData] = useState<TransferProps['dataSource']>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);


  const handlePrev = () => {
    setActive(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setActive(prev => Math.min(prev + 1, 3));
  };

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields();
      const result = await validateDatasource({name: values.name, config: {...values}});
      if (result.success) {
        message.success(t('test_connection_success_message', {time: result.time}));
      } else {
        message.error(t('test_connection_fail_message', {msg: result.errorMsg}));
      }
    } catch (error) {
      console.error(error);
      // Handle validation or network errors
    }
  };

  const handleSelectModels = async () => {
    // TODO: Implement import models functionality
    handleNext();
    const values = await form.validateFields();
    const data = {name: values.name, config: {...values}};
    setPLoading(true);
    const physicsModelNames = await getPhysicsModelNames(data);
    setFormData(data);
    setPhysicsModelData(physicsModelNames.map((item: string) => ({
      key: item,
      title: item
    })));
    setPLoading(false);
  };

  const handleConnectDatabase = async () => {
    try {
      const res = await createDatasource(formData);
      setCurrentVal(res);
      handleNext();
      onChange(res);
      if (targetKeys?.length) {
        message.success(t('connect_sync_models_tips', {name: formData.name}));
        syncModels(formData.name, targetKeys as string[]).then(() => {
          message.success(t('connect_sync_models_done_tips', {name: formData.name}));
        });
      }
    } catch (error) {
      console.error(error)
      // Handle validation or network errors
    }
  };

  const segmentTitle = "text-[16px] font-bold pb-[10px]";

  const onChangeModel: TransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChangeModel: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <Drawer
      title={t('connect_datasource')}
      width="50%"
      placement="right"
      onClose={onClose}
      open={visible}
    >
      <div style={{paddingBottom: 20}}>
        <Steps current={active} size="small">
          <Step title={t('connect_step_select_database')}/>
          <Step title={t('connect_step_connect_database')}/>
          <Step title={t('connect_step_select_models')}/>
          <Step title={t('connect_step_completed')}/>
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
          <Form.Item label={t('connect_database_tips')} name="dbKind">
            <Radio.Group name="dbKind">
              <div className={segmentTitle}>{t('connect_relational')}</div>
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
              <div className={segmentTitle}>{t('connect_document')}</div>
              <Radio value="mongodb">MongoDB</Radio>
              <div className={segmentTitle}>{t('connect_other')}</div>
              <Radio value="graphql" disabled>GraphQL</Radio>
              <Radio value="restAPI" disabled>HTTP API</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {active === 1 && (
          <>
            <Form.Item name="name" label={t('connection_name')}
                       rules={[{required: true}]}>
              <Input name="name"/>
            </Form.Item>
            {form.getFieldValue('dbKind') === 'mysql' && <MySQLConfig/>}
            {form.getFieldValue('dbKind') === 'sqlite' && <SQLiteConfig/>}
            {form.getFieldValue('dbKind') !== 'mysql' && form.getFieldValue('dbKind') !== 'sqlite' &&
              <CommonConfig/>}
          </>
        )}
        {
          active === 2 && (
            <>
              <Row>
                <Col span={24}>
                  <Title level={5}>{form.getFieldValue('name')}</Title>
                </Col>
                <Col span={24} style={{paddingBottom: "15px"}}>
                  <Spin spinning={pLoading}>
                    <Transfer
                      showSearch
                      pagination
                      dataSource={physicsModelData}
                      titles={[t('connect_transfer_source'), t('connect_transfer_target')]}
                      targetKeys={targetKeys}
                      selectedKeys={selectedKeys}
                      onChange={onChangeModel}
                      onSelectChange={onSelectChangeModel}
                      render={(item) => item.title}
                    />
                  </Spin>
                </Col>
              </Row>
            </>
          )
        }
        {active === 3 && (
          <>
            <Row>
              <Col span={24} style={{marginTop: 12, marginBottom: 12, textAlign: 'center'}}>
                <span>{t('connect_success_tips')}</span>
              </Col>
              <Col span={24}>
                <DatabaseInfo datasource={currentVal}/>
              </Col>
              <Col span={24} style={{textAlign: 'center'}}>
                <Button style={{marginTop: 12}} onClick={() => {
                  onClose();
                  setActive((0));
                }}>{t('close')}</Button>
              </Col>
            </Row>
          </>
        )}
        <Form.Item style={{textAlign: 'end'}} wrapperCol={{offset: 8, span: 16}}>
          <Space>
            {active !== 0 && active !== 3 && (
              <Button onClick={handlePrev}>{t('connect_go_back')}</Button>
            )}
            {active === 0 && (
              <Button type="primary" onClick={handleNext}>{t('connect_select_database')}</Button>
            )}
            {active === 1 && (
              <>
                <Button onClick={handleTestConnection}>{t('connect_test_connection')}</Button>
                <Button type="primary" onClick={handleSelectModels}>{t('connect_select_models')}</Button>
              </>
            )}
            {active === 2 && (
              <>
                <Button type="primary" onClick={handleConnectDatabase}>{t('connect_datasource')}</Button>
              </>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ConnectDatabaseDrawer;
