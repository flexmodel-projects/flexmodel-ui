import {CodeOutlined} from '@ant-design/icons';
import {Button, Col, Dropdown, Menu, Row, Segmented, Typography} from 'antd';
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

  return (
    <div className="pl-5 bg-white dark:bg-[#23232a] dark:text-[#f5f5f5] rounded-lg transition-colors duration-300">
      <Row>
        <Col span={12}>
          <div>
            {model?.name} {model?.comment}
            <Dropdown
              arrow
              overlay={
                <Menu>
                  <p>接口描述信息:</p>
                  <p>---</p>
                  <Typography.Paragraph
                    copyable
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {model?.idl}
                  </Typography.Paragraph>
                </Menu>
              }
            >
              <Button
                icon={<CodeOutlined />}
                type="text"
              />
            </Dropdown>
          </div>
        </Col>
        <Col
          className="text-right"
          span={12}
        >
          <Segmented
            options={options}
            value={selectedItem}
            onChange={val => setSelectedItem(val as string)}
          />
        </Col>
      </Row>
      <div className="mt-4">
        {selectedItem === 'field' && (
          <FieldList
            datasource={datasource}
            model={model}
          />
        )}
        {selectedItem === 'index' && (
          <IndexList
            datasource={datasource}
            model={model}
          />
        )}
        {selectedItem === 'record' && (
          <RecordList
            datasource={datasource}
            model={model}
          />
        )}
        {selectedItem === 'code' && (
          <CodeView
            datasource={datasource}
            model={model}
          />
        )}
      </div>
    </div>
  );
};

export default EntityView;
