import React, {useState} from 'react';
import {Button, Drawer, Form, notification, Tabs} from 'antd';
import {useTranslation} from 'react-i18next';
import {createModel} from '@/services/model.ts';
import {Entity} from '@/types/data-modeling';
import EntityForm from './EntityForm';
import EnumForm from './EnumForm';
import NativeQueryForm from './NativeQueryForm';

interface CreateModelProps {
  visible: boolean;
  datasource: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModelCreationDialog: React.FC<CreateModelProps> = ({
  visible,
  datasource,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('entity');

  // 实体表单相关状态
  const [entityForm] = Form.useForm();
  const [entityModel, setEntityModel] = useState<Entity>({
    name: '',
    type: 'ENTITY',
    fields: [],
    indexes: [],
  });

  // 枚举表单
  const [enumForm] = Form.useForm();

  // 本地查询表单
  const [nativeQueryForm] = Form.useForm();

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleEntitySubmit = async () => {
    try {
      const values = await entityForm.validateFields();
      const entityData = {
        ...values,
        type: 'ENTITY',
        fields: entityModel.fields,
        indexes: entityModel.indexes,
      };
      await createModel(datasource, entityData);
      notification.success({message: t('form_save_success')});

      // 清空表单内容
      entityForm.resetFields();
      setEntityModel({
        name: '',
        type: 'ENTITY',
        fields: [],
        indexes: [],
      });

      onConfirm();
    } catch (error) {
      console.error(error);
      notification.error({message: t('form_save_failed')});
    }
  };

  const handleEnumSubmit = async () => {
    try {
      const values = await enumForm.validateFields();
      const enumData = {
        ...values,
        type: 'ENUM',
      };
      await createModel(datasource, enumData);
      notification.success({message: t('form_save_success')});

      // 清空表单内容
      enumForm.resetFields();

      onConfirm();
    } catch (error) {
      console.error(error);
      notification.error({message: t('form_save_failed')});
    }
  };

  const handleNativeQuerySubmit = async () => {
    try {
      const values = await nativeQueryForm.validateFields();
      const queryData = {
        ...values,
        type: 'NATIVE_QUERY',
      };
      await createModel(datasource, queryData);
      notification.success({message: t('form_save_success')});

      // 清空表单内容
      nativeQueryForm.resetFields();

      onConfirm();
    } catch (error) {
      console.error(error);
      notification.error({message: t('form_save_failed')});
    }
  };

  // 统一的提交处理函数
  const handleSubmit = async () => {
    switch (activeTab) {
      case 'entity':
        await handleEntitySubmit();
        break;
      case 'enum':
        await handleEnumSubmit();
        break;
      case 'nativeQuery':
        await handleNativeQuerySubmit();
        break;
      default:
        break;
    }
  };

  const items = [
    {
      key: 'entity',
      label: t('new_entity'),
      children: (
        <EntityForm
          form={entityForm}
          entityModel={entityModel}
          datasource={datasource}
          onEntityModelChange={setEntityModel}
        />
      ),
    },
    {
      key: 'enum',
      label: t('new_enum'),
      children: (
        <EnumForm form={enumForm} />
      ),
    },
    {
      key: 'nativeQuery',
      label: t('new_native_query'),
      children: (
        <NativeQueryForm form={nativeQueryForm} />
      ),
    },
  ];

  return (
    <Drawer
      title={t('create_model')}
      open={visible}
      onClose={onCancel}
      width={800}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} type="primary">
            {t('confirm')}
          </Button>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={items}
      />
    </Drawer>
  );
};

export default ModelCreationDialog;
