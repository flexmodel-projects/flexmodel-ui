import React, {useState} from 'react';
import {message, theme} from 'antd';
import {useTranslation} from 'react-i18next';
import {ScriptImportPayload, ScriptType} from '@/types/data-source';
import IDLEditor from './IDLEditor';

interface IDLModelFormProps {
  mode: 'create' | 'edit';
  datasource: string;
  currentValue?: any;
  onConfirm: (form: any) => void;
  onCancel: () => void;
}

const IDLModelForm = React.forwardRef<any, IDLModelFormProps>(({
  mode: _mode, // eslint-disable-line @typescript-eslint/no-unused-vars
  datasource: _datasource, // eslint-disable-line @typescript-eslint/no-unused-vars
  currentValue: _currentValue, // eslint-disable-line @typescript-eslint/no-unused-vars
  onConfirm,
  onCancel,
}, ref) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  // 暴露提交方法给父组件
  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: handleCancel,
    getFieldsValue: () => ({ idlCode }),
    setFieldsValue: (values: any) => {
      if (values.idlCode) {
        setIdlCode(values.idlCode);
      }
    },
    validateFields: async () => {
      if (!idlCode.trim()) {
        throw new Error(t('enter_idl_code'));
      }
      return { idlCode };
    },
  }));
  const [idlCode, setIdlCode] = useState(`// ${t('idl_syntax_example')}
model example_model {
  id : Long @id @default(autoIncrement()),
  name : String @length("255") @comment("${t('name')}"),
  createdAt : DateTime @default(now()),
  enabled : Boolean @default("true"),
  @index(name: "IDX_name", unique: true, fields: [id, name: (sort: "desc")]),
  @comment("Example model")
}

enum ExampleEnum {
  VALUE1,
  VALUE2,
  VALUE3
}`);

  const handleSubmit = async () => {
    if (!idlCode.trim()) {
      message.error(t('enter_idl_code'));
      return;
    }

    const payload: ScriptImportPayload = {
      script: idlCode,
      type: ScriptType.IDL
    };

    onConfirm(payload);
  };

  const handleCancel = () => {
    // 清空编辑器内容
    setIdlCode(`// ${t('idl_syntax_example')}
model example_model {
  id : String @id @default(ulid()),
  name : String @length("255") @comment("${t('name')}"),
  createdAt : DateTime @default(now()),
  enabled : Boolean @default("true"),
}

enum ExampleEnum {
  VALUE1,
  VALUE2,
  VALUE3
}`);
    onCancel();
  };

  return (
    <div style={{ height: '600px', border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius }}>
      <IDLEditor
        value={idlCode}
        onChange={(value) => setIdlCode(value || '')}
        height="100%"
        showDocLink={true}
      />
    </div>
  );
});

export default IDLModelForm;
