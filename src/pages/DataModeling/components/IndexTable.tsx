import React from 'react';
import {Button, Space, Table, theme} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {Index} from '@/types/data-modeling';

interface IndexTableProps {
  indexes: Index[];
  onEdit: (index: Index) => void;
  onDelete: (indexName: string) => void;
  onAdd: () => void;
}

const IndexTable: React.FC<IndexTableProps> = ({
  indexes,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const columns = [
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {title: t('fields'), dataIndex: 'fields', key: 'fields', render: (fields: any[]) => fields.map(f => f.fieldName).join(', ')},
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (value: boolean) => (value ? t('yes') : t('no'))},
    {
      title: t('operations'),
      key: 'operation',
      render: (_: any, record: Index) => (
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
      dataSource={indexes}
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
          {t('new_index')}
        </Button>
      )}
    />
  );
};

export default IndexTable;
