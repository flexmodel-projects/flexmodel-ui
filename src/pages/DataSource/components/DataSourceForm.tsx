import React from 'react';
import {Form, Input} from 'antd';
import {useTranslation} from "react-i18next";
import MySQLConfig from "@/pages/DataSource/components/MySQLConfig";
import SQLiteConfig from "@/pages/DataSource/components/SQLiteConfig";
import CommonConfig from "@/pages/DataSource/components/CommonConfig";

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
        initialValue="USER"
      >
        <Input readOnly={readOnly} />
      </Form.Item>

      <Form.Item
        name="dbKind"
        label={t('database_type')}
        rules={[{ required: true, message: t('database_type_required') }]}
      >
        <Input readOnly={readOnly} />
      </Form.Item>

      {/* 根据数据库类型显示不同的配置表单 */}
      {dbKind === 'mysql' && <MySQLConfig readOnly={readOnly} />}
      {dbKind === 'sqlite' && <SQLiteConfig readOnly={readOnly} />}
      {dbKind && dbKind !== 'mysql' && dbKind !== 'sqlite' && <CommonConfig readOnly={readOnly} />}
    </>
  );
};

export default DataSourceForm;
