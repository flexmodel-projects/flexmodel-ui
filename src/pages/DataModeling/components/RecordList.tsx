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
import {createRecord, deleteRecord, getRecordList, updateRecord} from "@/services/record.ts";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import type {Field, MRecord, RecordListProps} from '@/types/data-modeling.d.ts';

const RecordList: React.FC<RecordListProps> = ({datasource, model}) => {
  const {t} = useTranslation();
  const [dialogFormVisible, setDialogFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [records, setRecords] = useState<{list: MRecord[]; total: number}>({list: [], total: 0});
  const [form] = Form.useForm();
  const [query, setQuery] = useState({current: 1, pageSize: 10});

  const idField = model?.fields?.find((f: Field) => f.type === 'id');

  const fieldMap: Record<string, Field> = model.fields.reduce((p: Record<string, Field>, c: Field) => {
    p[c.name] = c;
    return p;
  }, {} as Record<string, Field>);

  useEffect(() => {
    if (model) fetchRecords();
  }, [query, model]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const data = await getRecordList(datasource, model.name, query);
    setRecords(data as {list: MRecord[]; total: number});
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

  const formatFormFieldsValue = (changedValues: Record<string, any>): Record<string, any> => {
    const formattedValues: Record<string, any> = {};
    for (const [key, value] of Object.entries(changedValues)) {
      const field = fieldMap[key];
      switch (field.type) {
        case "Date":
          formattedValues[key] = dayjs(value as string, 'YYYY-MM-DD');
          break;
        case "DateTime":
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

  const formatValues = (changedValues: Record<string, any>) => {
    const formattedValues: Record<string, any> = {};
    for (const [key, value] of Object.entries(changedValues)) {
      const field = fieldMap[key];
      switch (field.type) {
        case "Date":
          formattedValues[key] = value?.format('YYYY-MM-DD');
          break;
        case "DateTime":
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
      case 'String':
        return <Input {...inputProps} />;
      case 'Text':
      case 'JSON':
        return <Input.TextArea {...inputProps} />;
      case 'Decimal':
      case 'INT':
      case 'Long':
        return <Input type="number" {...inputProps} />;
      case 'Boolean':
        return <Switch/>;
      case 'Date':
        return <DatePicker picker="date" style={{width: '100%'}} {...inputProps} />;
      case 'DateTime':
        return <DatePicker showTime style={{width: '100%'}}  {...inputProps} />;
      default:
        return <Input/>;
    }
  }, [editMode]);

  const columns: ColumnsType<MRecord> = model?.fields.map((field: Field) => ({
    title: field.name,
    dataIndex: field.name,
    key: field.name,
    render: (text: string) => {
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
    <div className="p-5 bg-white dark:bg-[#23232a] dark:text-[#f5f5f5] rounded-lg transition-colors duration-300">
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
        className="mt-4 bg-white dark:bg-[#23232a] dark:text-[#f5f5f5]"
      />

      <Pagination
        align="end"
        current={query.current}
        pageSize={query.pageSize}
        total={records.total}
        showTotal={(total, range) => t('pagination_total_text', {start: range[0], end: range[1], total: total})}
        onChange={(page, pageSize) => setQuery({...query, current: page, pageSize})}
        className="mt-4"
      />

      <Modal
        title={editMode ? `Edit ${model.name} Record` : `New ${model.name} Record`}
        open={dialogFormVisible}
        onCancel={() => setDialogFormVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          {model.fields.map((field: Field) => (
            editMode ? (
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
