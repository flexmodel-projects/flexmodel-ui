import React, {useRef} from 'react';
import {Form, Input} from 'antd';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@/store/appStore';
import Editor from '@monaco-editor/react';

interface Props { readOnly?: boolean }

const JsIdPForm: React.FC<Props> = ({ readOnly = false }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const editorRef = useRef<any>(null);
  // Editor value is controlled via Form instance render-prop below

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <>
      <Form.Item hidden name="type">
        <Input />
      </Form.Item>
      <Form.Item name="name" label={t('idp_provider_name')} rules={[{ required: true }]}>
        <Input readOnly={readOnly} />
      </Form.Item>
      <Form.Item name="script" label={t('idp_javascript')} tooltip={t('idp_javascript_tooltip') || undefined} rules={[{ required: true }]}>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, setFieldValue }) => (
            <div style={{ border: '1px solid var(--ant-color-border)', borderRadius: 6, overflow: 'hidden' }}>
              <Editor
                height="340px"
                language="javascript"
                value={getFieldValue('script') ?? ''}
                onChange={(val) => { if (!readOnly) setFieldValue('script', val ?? ''); }}
                onMount={handleEditorDidMount}
                theme={isDark ? 'vs-dark' : 'vs'}
                options={{
                  readOnly: readOnly,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontSize: 14,
                  wordWrap: 'on'
                }}
              />
            </div>
          )}
        </Form.Item>
      </Form.Item>
    </>
  );
};

export default JsIdPForm;


