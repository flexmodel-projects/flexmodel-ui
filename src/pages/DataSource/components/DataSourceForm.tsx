import React from 'react';
import {Form, Input, Typography} from 'antd';
import {useTranslation} from "react-i18next";
import MySQLConnectionForm from "@/pages/DataSource/components/MySQLConnectionForm";
import SQLiteConnectionForm from "@/pages/DataSource/components/SQLiteConnectionForm";
import GenericConnectionForm from "@/pages/DataSource/components/GenericConnectionForm";

interface DataSourceFormProps {
  readOnly?: boolean;
}

const DataSourceForm: React.FC<DataSourceFormProps> = ({ readOnly = false }) => {
  const { t } = useTranslation();

  const dbKind = Form.useWatch('dbKind');

  return (
    <>
      <Form.Item
        name="name"
        label={t('connection_name')}
        rules={[{ required: true, message: t('connection_name_required') }]}
      >
        <Input readOnly={readOnly} placeholder={t('connection_name_placeholder')} />
      </Form.Item>

      <Form.Item
        name="type"
        label={t('connection_type')}
      >
        <Typography.Text>{Form.useWatch('type') || 'USER'}</Typography.Text>
      </Form.Item>

      <Form.Item
        name="dbKind"
        label={t('database_type')}
      >
        <Typography.Text>{Form.useWatch('dbKind')}</Typography.Text>
      </Form.Item>

      {/* 根据数据库类型显示不同的配置表单 */}
      {dbKind === 'mysql' && <MySQLConnectionForm readOnly={readOnly} />}
      {dbKind === 'sqlite' && <SQLiteConnectionForm readOnly={readOnly} />}
      {dbKind && dbKind !== 'mysql' && dbKind !== 'sqlite' && <GenericConnectionForm readOnly={readOnly} />}
    </>
  );
};

export default DataSourceForm;
