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
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {createRecord, deleteRecord, getRecordList, updateRecord} from "../../../api/record.ts";
import dayjs from "dayjs";

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

interface Model {
  name: string;
  comment?: string;
  fields: Field[];
  idField?: Field;
}

interface RecordListProps {
  datasource: string;
  model: Model;
}

const RecordList: React.FC<RecordListProps> = ({datasource, model}) => {
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
        case "date":
          formattedValues[key] = dayjs(value as string, 'YYYY-MM-DD');
          break;
        case "datetime":
          formattedValues[key] = dayjs(value as string);
          break;
        case "json":
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
        case "date":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          formattedValues[key] = value?.format('YYYY-MM-DD');
          break;
        case "datetime":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          formattedValues[key] = value?.format('YYYY-MM-DDThh:mm');
          break;
        case "json":
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
      case 'id':
        return <Input disabled={editMode}/>;
      case 'string':
        return <Input {...inputProps} />;
      case 'text':
      case 'json':
        return <Input.TextArea {...inputProps} />;
      case 'decimal':
      case 'int':
      case 'bigint':
        return <Input type="number" {...inputProps} />;
      case 'boolean':
        return <Switch/>;
      case 'date':
        return <DatePicker picker="date" style={{width: '100%'}} {...inputProps} />;
      case 'datetime':
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
      return (field.type === 'text' || field.type === 'json') ? (
        <Tooltip title={fmtText}>
          <span style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block'}}>
            {fmtText}
          </span>
        </Tooltip>
      ) : fmtText;
    },
  })) || [];

  columns.push({
    title: 'Operations',
    key: 'operations',
    fixed: 'right',
    width: 180,
    render: (_, record) => (
      <>
        <Button size="small" type="link" icon={<EditOutlined/>} onClick={() => handleEdit(record)}>Edit</Button>
        <Popconfirm title="Are you sure to delete this record?" onConfirm={() => handleDelete(record)}>
          <Button size="small" type="link" icon={<DeleteOutlined/>} danger>Delete</Button>
        </Popconfirm>
      </>
    ),
  });

  return model ? (
    <div style={{padding: '20px'}}>
      <Row justify="space-between">
        <Col>{model.name} {model.comment}</Col>
        <Col>
          <Button type="primary" onClick={() => {
            setDialogFormVisible(true);
            setEditMode(false);
          }}>
            New Record
          </Button>
        </Col>
      </Row>

      <Table
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
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
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
            field.type !== 'id'
            || field.generatedValue === 'BIGINT_NOT_GENERATED'
            || field.generatedValue === 'STRING_NOT_GENERATED'
            || editMode ? (
              <Form.Item key={field.name} name={field.name} label={field.name}
                         rules={[{required: !field.nullable, message: `Please input ${field.name}`}]}>
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
