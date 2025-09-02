import React from 'react';
import {Form, Input} from 'antd';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/store/appStore';
import Editor from '@monaco-editor/react';

interface Props { readOnly?: boolean }

const ScriptIdPForm: React.FC<Props> = ({ readOnly = false }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  // Editor value is controlled via Form instance render-prop below

  return (
    <>
      <Form.Item hidden name="type" initialValue="script" />
      <Form.Item name="name" label={t('idp_provider_name')} rules={[{ required: true }]}>
        <Input readOnly={readOnly} />
      </Form.Item>
      <Form.Item name="script" label={t('idp_script')} tooltip={t('idp_script_tooltip') || undefined} rules={[{ required: true }]}>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldValue }) => (
            <div style={{ border: '1px solid var(--ant-color-border)', borderRadius: 6, overflow: 'hidden' }}>
              <Editor
                height="340px"
                defaultLanguage="javascript"
                value={getFieldValue('script') ?? ''}
                onChange={(val) => { if (!readOnly) setFieldValue('script', val ?? ''); }}
                theme={isDark ? 'vs-dark' : 'light'}
                options={{ readOnly: readOnly, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false }}
              />
            </div>
          )}
        </Form.Item>
      </Form.Item>
    </>
  );
};

export default ScriptIdPForm;


