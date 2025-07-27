import {CodeOutlined} from '@ant-design/icons';
import {Button, Card, Col, Dropdown, Menu, Row, Segmented, Space, Typography} from 'antd';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import CodeView from './CodeView';
import FieldList from './FieldList';
import IndexList from './IndexList';
import RecordList from './RecordList';

interface Props {
  datasource: string;
  model: any;
}

const EntityView = ({ datasource, model }: Props) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<string>('field');

  // 选项设置
  const options = [
    { label: t('field'), value: 'field' },
    { label: t('index'), value: 'index' },
    { label: t('record'), value: 'record' },
    { label: t('code'), value: 'code' }
  ];

  const renderContent = () => {
    switch (selectedItem) {
      case 'field':
        return <FieldList datasource={datasource} model={model} />;
      case 'index':
        return <IndexList datasource={datasource} model={model} />;
      case 'record':
        return <RecordList datasource={datasource} model={model} />;
      case 'code':
        return <CodeView datasource={datasource} model={model} />;
      default:
        return null;
    }
  };

  return (
    <Card size="small">
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Space align="center">
            <Typography.Title level={5} style={{ margin: 0 }}>
              {model?.name} {model?.comment}
            </Typography.Title>
            <Dropdown
              arrow
              overlay={
                <Menu>
                  <Menu.Item key="description">
                    <Typography.Text strong>接口描述信息:</Typography.Text>
                    <Typography.Paragraph
                      copyable
                      style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0 0' }}
                    >
                      {model?.idl}
                    </Typography.Paragraph>
                  </Menu.Item>
                </Menu>
              }
            >
              <Button
                icon={<CodeOutlined />}
                type="text"
                size="small"
              />
            </Dropdown>
          </Space>
        </Col>
        <Col>
          <Segmented
            options={options}
            value={selectedItem}
            onChange={val => setSelectedItem(val as string)}
            size="small"
          />
        </Col>
      </Row>
      {renderContent()}
    </Card>
  );
};

export default EntityView;

