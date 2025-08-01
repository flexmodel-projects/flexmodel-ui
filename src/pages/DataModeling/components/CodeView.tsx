import {DownloadOutlined, DownOutlined, ReloadOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, Row, Select, Space, Spin} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {t} from 'i18next';
import React, {useEffect, useRef, useState} from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Explore from '@/components/explore/explore/Explore.jsx';
import {getFileAsBlob, getTemplateNames} from '@/services/codegen.js';

import type {Model} from '@/types/data-modeling';

interface CodeViewProps {
  datasource: string;
  model: Partial<Model>;
}

const CodeView: React.FC<CodeViewProps> = ({ datasource }) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpand, setIsExpand] = useState<boolean>(true);
  const exploreRef: any = useRef(null);

  const [options, setOptions] = useState<{ label: string; value: string }[]>();
  const [templateName, setTemplateName] = useState<string>('');
  const [variables, setVariables] = useState<string>('');

  const downloadZip = () => {
    exploreRef?.current?.downloadZip();
  };

  /**
   * 点击搜索
   *
   * @param val
   */
  const handleExplore = (val: string) => {
    setIsLoading(true);
    setTemplateName(val);
    getFileAsBlob(`/codegen/${datasource}_${val}.zip?variables=${encodeURIComponent(variables)}`).then(b => {
      setBlob(b);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (templateName) {
      getFileAsBlob(
        `/codegen/${datasource}_${templateName}.zip?variables=${encodeURIComponent(variables)}`
      ).then(b => {
        setBlob(b);
        setIsLoading(false);
      });
    }
  }, [datasource, templateName]);

  useEffect(() => {
    getTemplateNames().then((res: string[]) => {
      setOptions(
        res.map((item: string) => ({
          label: item,
          value: item
        }))
      );
      setTemplateName(res[0]);
      setVariables('{"foo":"bar"}');
    });
  }, []);

  return (
    <Card size="small" bodyStyle={{ padding: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {isExpand && (
          <Form.Item
            label="配置模板变量"
            style={{ marginBottom: 8 }}
          >
            <TextArea value={variables} />
          </Form.Item>
        )}
        <Row gutter={8}>
          <Col span={14}>
            <Form.Item
              label="选择代码模板"
              style={{ marginBottom: 8 }}
            >
              <Select
                options={options}
                value={templateName}
                onSelect={val => {
                  handleExplore(val);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item style={{ marginBottom: 8 }}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  type="primary"
                  size="small"
                  onClick={() => handleExplore(templateName)}
                >
                  重新生成
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  size="small"
                  onClick={() => downloadZip()}
                >
                  下载源码
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setIsExpand(!isExpand);
                  }}
                >
                  {isExpand ? (
                    <>
                      {t('collapse')} <UpOutlined />
                    </>
                  ) : (
                    <>
                      {t('expand')} <DownOutlined />
                    </>
                  )}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
        <Spin spinning={isLoading}>
          <Explore
            blob={blob}
            projectName={`${datasource}_${templateName}.zip`}
            ref={exploreRef}
          />
        </Spin>
      </Space>
    </Card>
  );
};

export default CodeView;

