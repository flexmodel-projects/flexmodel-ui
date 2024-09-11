import React, { useEffect, useState } from 'react';
import { Card, Col, Input, Row, Table, Collapse } from 'antd';
import { getVariables } from "../../../api/environment.ts";
import HidePassword from "../../../components/HidePassword.tsx";

const { Panel } = Collapse;

const Variables: React.FC = () => {
  const [variables, setVariables] = useState<{ environment: Record<string, string>, system: Record<string, string> }>({ environment: {}, system: {} });
  const [filterKeyword, setFilterKeyword] = useState<string>('');

  // 获取变量数据
  useEffect(() => {
    const fetchVariables = async () => {
      const vars = await getVariables();
      setVariables(vars);
    };
    fetchVariables();
  }, []);

  // 过滤环境变量
  const environmentVariables = Object.keys(variables.environment || {})
    .filter(key => key.includes(filterKeyword))
    .map(key => ({ key, value: variables.environment[key] }));

  // 过滤系统变量
  const systemVariables = Object.keys(variables.system || {})
    .filter(key => key.includes(filterKeyword))
    .map(key => ({ key, value: variables.system[key] }));

  // 表格列定义
  const columns = [
    {
      title: 'Variable Name',
      dataIndex: 'key',
      key: 'key',
      width: 500,
    },
    {
      title: 'Variable Value',
      dataIndex: 'value',
      key: 'value',
      render: (text: string) => <HidePassword text={text} />,
    },
  ];

  return (
    <Card>
      <Row>
        <Col span={12}>
          <h2>Variables</h2>
        </Col>
        <Col span={6}></Col>
        <Col span={6}>
          <Input
            placeholder="Search variables"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <div style={{ height: '540px', overflow: 'auto' }}>
        <Collapse defaultActiveKey={['1','2']} ghost>
          <Panel header="Environment Variables" key="1">
            <Table
              size="small"
              dataSource={environmentVariables}
              columns={columns}
              pagination={false}
              rowKey="key"
            />
          </Panel>
          <Panel header="System Variables" key="2">
            <Table
              size="small"
              dataSource={systemVariables}
              columns={columns}
              pagination={false}
              rowKey="key"
            />
          </Panel>
        </Collapse>
      </div>
    </Card>
  );
};

export default Variables;
