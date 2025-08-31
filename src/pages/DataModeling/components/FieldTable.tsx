import React from 'react';
import {Button, Space, Table, theme} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Field} from '@/types/data-modeling';

interface FieldTableProps {
  fields: Field[];
  onEdit: (field: Field) => void;
  onDelete: (fieldName: string) => void;
  onAdd: () => void;
}

const FieldTable: React.FC<FieldTableProps> = ({
  fields,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const columns = [
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {title: t('type'), dataIndex: 'type', key: 'type'},
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (value: boolean) => (value ? t('yes') : t('no'))},
    {title: t('nullable'), dataIndex: 'nullable', key: 'nullable', render: (value: boolean) => (value ? t('yes') : t('no'))},
    {title: t('comment'), dataIndex: 'comment', key: 'comment'},
    {
      title: t('operations'),
      key: 'operation',
      render: (_: any, record: Field) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => onEdit(record)}
          >
            {t('edit')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => onDelete(record.name)}
          >
            {t('delete')}
          </Button>
        </Space>
      ),
    },
  ];

  const tableStyle = {
    marginTop: token.marginSM,
  };

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={fields}
      pagination={false}
      rowKey={(record) => record.name}
      style={tableStyle}
      footer={() => (
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          style={{width: '100%'}}
          onClick={onAdd}
          ghost
          size="small"
        >
          {t('new_field')}
        </Button>
      )}
    />
  );
};

export default FieldTable;
