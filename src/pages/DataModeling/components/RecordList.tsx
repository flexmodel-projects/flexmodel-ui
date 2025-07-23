import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tooltip
} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {createRecord, deleteRecord, getRecordList, updateRecord} from "../../../services/record.ts";
import dayjs from "dayjs";
import {Entity} from "../data";
import {useTranslation} from "react-i18next";

interface Field {
  name: string;
  type: string;
  nullable?: boolean;
  comment?: string;
  generatedValue?: 'AUTO_INCREMENT' | 'BIGINT_NOT_GENERATED' | 'STRING_NOT_GENERATED';
}

interface MRecord {
  [key: string]: any;
}

interface RecordListProps {
  datasource: string;
  model: Entity;
}

const RecordList: React.FC<RecordListProps> = ({datasource, model}) => {
  const {t} = useTranslation();
  const [dialogFormVisible, setDialogFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [records, setRecords] = useState({list: [], total: 0});
  const [form] = Form.useForm();
  const [query, setQuery] = useState({current: 1, pageSize: 10});

  const idField = model?.fields?.find(f => f.type === 'id');

  const fieldMap: Record<string, Field> = model.fields.reduce((p, c) => {
    p[c.name] = c
    return p
  }, {} as Record<string, Field>);

  useEffect(() => {
    if (model) fetchRecords();
  }, [query, model]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const data = await getRecordList(datasource, model.name, query);
    setRecords(data);
    setLoading(false);
  }, [datasource, model.name, query]);

  const handleEdit = (record: MRecord) => {
    setDialogFormVisible(true);
    setEditMode(true);

    form.setFieldsValue(formatFormFieldsValue(record));
  };

  const handleDelete = async (record: MRecord) => {
    if (!idField) {
      message.warning("Can't delete a record without ID!");
      return;
    }
    await deleteRecord(datasource, model.name, record[idField.name]);
    await fetchRecords();
  };

  const formatFormFieldsValue = (changedValues: any): Record<string, any> => {
    const formattedValues: Record<string, any> = {};
    for (const [key, value] of Object.entries(changedValues)) {
      const field = fieldMap[key];
      switch (field.type) {
        case "DATE":
          formattedValues[key] = dayjs(value as string, 'YYYY-MM-DD');
          break;
        case "DATETIME":
          formattedValues[key] = dayjs(value as string);
          break;
        case "JSON":
          formattedValues[key] = JSON.stringify(value);
          break;
        default:
          formattedValues[key] = value;
      }
    }
    return formattedValues;
  }

  const formatValues = (changedValues: any) => {
    const formattedValues: Record<string, any> = {};
    for (const [key, value] of Object.entries(changedValues)) {
      const field = fieldMap[key];
      switch (field.type) {
        case "DATE":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          formattedValues[key] = value?.format('YYYY-MM-DD');
          break;
        case "DATETIME":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          formattedValues[key] = value?.format('YYYY-MM-DDThh:mm');
          break;
        case "JSON":
          formattedValues[key] = JSON.parse(value as string);
          break;
        default:
          formattedValues[key] = value;
      }
    }
    return formattedValues;
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editMode) {
        if (!idField) {
          message.warning("Can't edit a record without ID!");
          return;
        }
        await updateRecord(datasource, model.name, values[idField.name], formatValues(values));
      } else {
        await createRecord(datasource, model.name, formatValues(values));
      }
      await fetchRecords();
      setDialogFormVisible(false);
    } catch (errorInfo) {
      console.error('Failed:', errorInfo);
    }
  };

  const renderFieldInput = useCallback((field: Field) => {
    const inputProps = {placeholder: field.comment};
    switch (field.type) {
      case 'ID':
        return <Input disabled={editMode}/>;
      case 'STRING':
        return <Input {...inputProps} />;
      case 'TEXT':
      case 'JSON':
        return <Input.TextArea {...inputProps} />;
      case 'DECIMAL':
      case 'INT':
      case 'BIGINT':
        return <Input type="number" {...inputProps} />;
      case 'BOOLEAN':
        return <Switch/>;
      case 'DATE':
        return <DatePicker picker="date" style={{width: '100%'}} {...inputProps} />;
      case 'DATETIME':
        return <DatePicker showTime style={{width: '100%'}}  {...inputProps} />;
      default:
        return <Input/>;
    }
  }, [editMode]);

  const columns: ColumnsType<MRecord> = model?.fields.map(field => ({
    title: field.name,
    dataIndex: field.name,
    key: field.name,
    render: (text) => {
      const fmtText = (typeof text === 'object' ? JSON.stringify(text) : text);
      return (field.type === 'TEXT' || field.type === 'JSON') ? (
        <Tooltip title={fmtText}>
          <span style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block'}}>
            {fmtText}
          </span>
        </Tooltip>
      ) : fmtText;
    },
  })) || [];

  columns.push({
    title: t('operations'),
    key: 'operations',
    fixed: 'right',
    width: 180,
    render: (_, record) => (
      <>
        <Button size="small" type="link" icon={<EditOutlined/>} onClick={() => handleEdit(record)}>{t('edit')}</Button>
        <Popconfirm title={t('table_selection_delete_text')} onConfirm={() => handleDelete(record)}>
          <Button size="small" type="link" icon={<DeleteOutlined/>} danger>{t('delete')}</Button>
        </Popconfirm>
      </>
    ),
  });

  return model ? (
    <div style={{padding: '20px'}}>
      <Row justify="space-between">
        <Col></Col>
        <Col>
          <Button type="primary"
                  icon={<PlusOutlined/>}
                  onClick={() => {
                    setDialogFormVisible(true);
                    setEditMode(false);
                  }}>
            {t('new_record')}
          </Button>
        </Col>
      </Row>

      <Table
        sticky
        loading={loading}
        scroll={{y: 400}}
        columns={columns}
        dataSource={records.list}
        pagination={false}
        rowKey={idField?.name}
        style={{marginTop: 16}}
      />

      <Pagination
        align="end"
        current={query.current}
        pageSize={query.pageSize}
        total={records.total}
        showTotal={(total, range) => t('pagination_total_text', {start: range[0], end: range[1], total: total})}
        onChange={(page, pageSize) => setQuery({...query, current: page, pageSize})}
        style={{marginTop: 16}}
      />

      <Modal
        title={editMode ? `Edit ${model.name} Record` : `New ${model.name} Record`}
        open={dialogFormVisible}
        onCancel={() => setDialogFormVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          {model.fields.map(field => (
            field.type !== 'ID'
            || field.generatedValue === 'BIGINT_NOT_GENERATED'
            || field.generatedValue === 'STRING_NOT_GENERATED'
            || editMode ? (
              <Form.Item key={field.name} name={field.name} label={field.name}
                         rules={[{required: !field.nullable, message: `${t('input_valid_msg', {name: field.name})}`}]}>
                {renderFieldInput(field)}
              </Form.Item>
            ) : null
          ))}
        </Form>
      </Modal>
    </div>
  ) : <Empty/>;
};

export default RecordList;
