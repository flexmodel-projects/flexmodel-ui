import {DownloadOutlined, DownOutlined, ReloadOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, Row, Select, Space, Spin} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {t} from 'i18next';
import React, {useEffect, useRef, useState} from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Explore from '@/components/explore/explore/Explore.jsx';
import {getFileAsBlob, getTemplates} from '@/services/codegen.js';

import type {Model} from '@/types/data-modeling';

interface CodeViewProps {
  datasource: string;
  model: Partial<Model>;
}

const CodeView: React.FC<CodeViewProps> = ({datasource}) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpand, setIsExpand] = useState<boolean>(true);
  const exploreRef: any = useRef(null);

  const [options, setOptions] = useState<{ label: string; value: string }[]>();
  const [templateName, setTemplateName] = useState<string>('');
  const [variables, setVariables] = useState<string>('');
  const [templatesData, setTemplatesData] = useState<{ name: string, variables: object }[]>([]);

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

  /**
   * 处理模板选择变化
   *
   * @param val
   */
  const handleTemplateChange = (val: string) => {
    setTemplateName(val);
    // 根据选择的模板更新变量
    const selectedTemplate = templatesData.find(template => template.name === val);
    if (selectedTemplate) {
      setVariables(JSON.stringify(selectedTemplate.variables, null, 2));
    }
    handleExplore(val);
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
  }, [datasource, templateName, variables]);

  useEffect(() => {
    getTemplates().then((res: { name: string, variables: object }[]) => {
      setTemplatesData(res);
      setOptions(
        res.map((item: any) => ({
          label: item?.name,
          value: item?.name
        }))
      );
      if (res.length > 0) {
        setTemplateName(res[0].name);
        setVariables(JSON.stringify(res[0]?.variables, null, 2));
      }
    });
  }, []);

  return (
    <Card size="small" bodyStyle={{padding: 12, overflowY: 'auto'}}>
      <Space direction="vertical" style={{width: '100%'}} size="small">
        {isExpand && (
          <Form.Item
            label={t('code_view.config_template_variables')}
            style={{marginBottom: 8}}
            help={t('code_view.config_template_variables_help')}
          >
            <TextArea 
              value={variables} 
              onChange={e => setVariables(e.target.value)}
              rows={3}
              placeholder={t('code_view.variables_placeholder')}
              style={{fontFamily: 'monospace'}}
            />
          </Form.Item>
        )}
        <Row gutter={8}>
          <Col span={14}>
            <Form.Item
              label={t('code_view.select_code_template')}
              style={{marginBottom: 8}}
            >
              <Select
                options={options}
                value={templateName}
                onSelect={handleTemplateChange}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item style={{marginBottom: 8}}>
              <Space>
                <Button
                  icon={<ReloadOutlined/>}
                  type="primary"
                  size="small"
                  onClick={() => handleExplore(templateName)}
                >
                  {t('code_view.regenerate')}
                </Button>
                <Button
                  icon={<DownloadOutlined/>}
                  size="small"
                  onClick={() => downloadZip()}
                >
                  {t('code_view.download_source')}
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
                      {t('collapse')} <UpOutlined/>
                    </>
                  ) : (
                    <>
                      {t('expand')} <DownOutlined/>
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

