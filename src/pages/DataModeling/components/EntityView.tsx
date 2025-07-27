import {CodeOutlined} from '@ant-design/icons';
import {Button, Col, Dropdown, Menu, Row, Segmented, theme, Typography} from 'antd';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import CodeView from './CodeView';
import FieldList from './FieldList';
import IndexList from './IndexList';
import RecordList from './RecordList';
import {getCompactCardStyle} from '@/utils/theme';

interface Props {
  datasource: string;
  model: any;
}

const EntityView = ({ datasource, model }: Props) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [selectedItem, setSelectedItem] = useState<string>('field');

  // 选项设置
  const options = [
    { label: t('field'), value: 'field' },
    { label: t('index'), value: 'index' },
    { label: t('record'), value: 'record' },
    { label: t('code'), value: 'code' }
  ];

  // 紧凑主题样式
  const containerStyle = {
    ...getCompactCardStyle(token),
    padding: token.paddingSM,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    border: ` ${token.colorBorder}`,
  };

  const headerStyle = {
    marginBottom: token.marginSM,
  };

  const titleStyle = {
    fontSize: token.fontSizeLG,
    fontWeight: token.fontWeightStrong,
    color: token.colorText,
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
  };

  const segmentedStyle = {
    fontSize: token.fontSizeSM,
  };

  const contentStyle = {
    marginTop: token.marginSM,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <Row>
          <Col span={12}>
            <div style={titleStyle}>
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
                  size="small"
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
              size="small"
              style={segmentedStyle}
            />
          </Col>
        </Row>
      </div>
      <div style={contentStyle}>
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
