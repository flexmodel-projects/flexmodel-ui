import React, {useState} from 'react';
import {Button, Drawer, message, theme} from 'antd';
import {useTranslation} from 'react-i18next';
import {importModels} from '@/services/datasource';
import {ScriptImportPayload, ScriptType} from '@/types/data-source';
import IDLEditor from './IDLEditor';

interface CreateModelProps {
  visible: boolean;
  datasource: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const IDLModelForm: React.FC<CreateModelProps> = ({
  visible,
  datasource,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      const payload: ScriptImportPayload = {
        script: idlCode,
        type: ScriptType.IDL
      };

      await importModels(datasource, payload);
      message.success(t('model_created_success'));
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
      onConfirm();
    } catch (error) {
      console.error(t('create_model_failed'), error);
      message.error(t('model_creation_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={t('create_model_by_idl')}
      open={visible}
      onClose={onCancel}
      width={1000}
      footer={
        <div style={{ textAlign: 'left' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            type="primary"
            loading={loading}
          >
            {t('confirm')}
          </Button>
        </div>
      }
    >
      <div style={{ height: '600px', border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius }}>
        <IDLEditor
          value={idlCode}
          onChange={(value) => setIdlCode(value || '')}
          height="100%"
          showDocLink={true}
        />
      </div>
    </Drawer>
  );
};

export default IDLModelForm;
