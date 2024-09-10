import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Form, Input, Modal, Row, Switch, Table, Pagination, message, DatePicker} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

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
  createRecord?: (datasource: string, modelName: string, data: Record) => Promise<void>;
  updateRecord?: (datasource: string, modelName: string, id: any, data: Record) => Promise<void>;
  deleteRecord?: (datasource: string, modelName: string, id: any) => Promise<void>;
  getRecordList?: (datasource: string, modelName: string, query: { current: number; pageSize: number }) => Promise<{ list: Record[]; total: number }>;
}

const RecordList: React.FC<RecordListProps> = ({ datasource, model, createRecord, updateRecord, deleteRecord, getRecordList }) => {
  const [dialogFormVisible, setDialogFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [records, setRecords] = useState<{ list: Record[]; total: number }>({list: [], total: 0});
  const [form] = Form.useForm();
  const [query, setQuery] = useState({current: 1, pageSize: 10, filter: '', sort: ''});

  useEffect(() => {
    fetchRecords();
  }, [query, model]);

  useEffect(() => {
    // Define form rules based on the model fields
    const rules: any = {};
    model.fields.forEach(field => {
      rules[field.name] = [{required: !field.nullable, message: `Please input ${field.name}`}];
    });
    form.setFields(Object.keys(rules).map(key => ({
      name: key,
      rules: rules[key]
    })));
  }, [form, model.fields]);

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
        await updateRecord(datasource, model.name, values[model.idField?.name], values);
      } else {
        await createRecord(datasource, model.name, values);
      }
      fetchRecords();
      setDialogFormVisible(false);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const columns: ColumnsType<Record> = [
    ...model.fields.map(field => ({
      title: field.name,
      dataIndex: field.name,
      key: field.name,
      width: 100,

      render: (text: any) => (typeof text === 'object' ? JSON.stringify(text) : text),
    })),
    {
      title: 'Operations',
      key: 'operations',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <>
          <Button size="small" type="link" icon={<EditOutlined/>} onClick={() => handleEdit(record)}>Edit</Button>
          <Button size="small" type="link" icon={<DeleteOutlined/>} danger onClick={() => handleDelete(record)}
                  style={{marginLeft: 8}}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={12}>
                {model.name} {model.comment}
              </Col>
              <Col span={12} style={{textAlign: 'right'}}>
                <Button type="primary" onClick={() => {
                  setDialogFormVisible(true);
                  setEditMode(false);
                }}>
                  New Record
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            <Table
              loading={loading}
              scroll={{x: 1500, y: 400}}
              style={{width: '100%'}}
              size="small"
              columns={columns}
              dataSource={records.list}
              pagination={false}
              rowKey={(record) => record[model.idField?.name] || 'id'}
            />
            <Pagination
              current={query.current}
              pageSize={query.pageSize}
              total={records.total}
              onChange={(page, pageSize) => setQuery(prev => ({...prev, current: page, pageSize}))}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title={editMode ? `Edit ${model.name} Record` : `New ${model.name} Record`}
        visible={dialogFormVisible}
        onCancel={() => setDialogFormVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {model.fields.map(field => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.name}
              rules={[{required: !field.nullable, message: `Please input ${field.name}`}]}
            >
              {field.type === 'id' ? (
                <Input disabled={editMode}/>
              ) : field.type === 'string' ? (
                <Input placeholder={field.comment}/>
              ) : field.type === 'text' ? (
                <Input.TextArea placeholder={field.comment}/>
              ) : field.type === 'decimal' || field.type === 'int' || field.type === 'bigint' ? (
                <Input type="number" placeholder={field.comment}/>
              ) : field.type === 'boolean' ? (
                <Switch/>
              ) : field.type === 'date' ? (
                <DatePicker placeholder={field.comment} style={{width: '100%'}}/>
              ) : field.type === 'datetime' ? (
                <DatePicker picker="datetime" placeholder={field.comment} style={{width: '100%'}}/>
              ) : field.type === 'json' ? (
                <Input.TextArea placeholder={field.comment}/>
              ) : (
                <Input/>
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default RecordList;
