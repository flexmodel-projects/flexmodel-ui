import React, {useEffect, useState} from 'react';
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
  Row,
  Switch,
  Table,
  Tooltip
} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {createRecord, deleteRecord, getRecordList, updateRecord} from "../../../api/record.ts";

interface Field {
  name: string;
  type: string;
  nullable?: boolean;
  comment?: string;
}

interface Record {
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

const RecordList: React.FC<RecordListProps> = ({
                                                 datasource,
                                                 model,
                                               }) => {
  const [dialogFormVisible, setDialogFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [records, setRecords] = useState({list: [], total: 0});
  const [form] = Form.useForm();
  const [query, setQuery] = useState({current: 1, pageSize: 10});

  useEffect(() => {
    if (model) fetchRecords();
  }, [query, model]);

  const fetchRecords = async () => {
    setLoading(true);
    const data = await getRecordList(datasource, model.name, query);
    setRecords(data);
    setLoading(false);
  };

  const handleEdit = (record: Record) => {
    setDialogFormVisible(true);
    setEditMode(true);
    form.setFieldsValue(record);
  };

  const handleDelete = async (record: Record) => {
    if (!model.idField) {
      message.warning("Can't delete a record without ID!");
      return;
    }
    await deleteRecord(datasource, model.name, record[model.idField.name]);
    fetchRecords();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editMode) {
        const idField = model.fields.filter(f => f.type === 'id')[0];
        if (!idField) {
          message.warning('Update field, ID field not found!');
          return;
        }
        await updateRecord(datasource, model.name, values[idField.name], values);
      } else {
        await createRecord(datasource, model.name, values);
      }
      fetchRecords();
      setDialogFormVisible(false);
    } catch (errorInfo) {
      console.error('Failed:', errorInfo);
    }
  };

  const renderFieldInput = (field: Field) => {
    switch (field.type) {
      case 'id':
        return <Input disabled={editMode}/>;
      case 'string':
      case 'text':
      case 'json':
        return field.type === 'text' ? <Input.TextArea placeholder={field.comment}/> :
          <Input placeholder={field.comment}/>;
      case 'decimal':
      case 'int':
      case 'bigint':
        return <Input type="number" placeholder={field.comment}/>;
      case 'boolean':
        return <Switch/>;
      case 'date':
        return <DatePicker placeholder={field.comment} style={{width: '100%'}}/>;
      case 'datetime':
        return <DatePicker picker="datetime" placeholder={field.comment} style={{width: '100%'}}/>;
      default:
        return <Input/>;
    }
  };

  const columns: ColumnsType<Record> = model?.fields.map(field => ({
    title: field.name,
    dataIndex: field.name,
    key: field.name,
    render: (text) => {
      const fmtText = (typeof text === 'object' ? JSON.stringify(text) : text);
      if (field.type === 'text' || field.type == 'json') {
        return (<Tooltip title={fmtText}>
          <span
            style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block'}}>
          {fmtText}
         </span>
        </Tooltip>);
      }
      return fmtText;
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
        <Button size="small" type="link" icon={<DeleteOutlined/>} danger onClick={() => handleDelete(record)}
                style={{marginLeft: 8}}>
          Delete
        </Button>
      </>
    ),
  });

  return (
    model ? (
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
          rowKey={(record) => record[model.idField?.name] || 'id'}
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
              <Form.Item key={field.name} name={field.name} label={field.name}
                         rules={[{required: !field.nullable, message: `Please input ${field.name}`}]}>
                {renderFieldInput(field)}
              </Form.Item>
            ))}
          </Form>
        </Modal>
      </div>
    ) : <Empty/>
  );
};

export default RecordList;
