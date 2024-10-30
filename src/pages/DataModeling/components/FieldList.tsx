import React, {useCallback, useEffect, useState} from 'react';
import {Button, notification, Popconfirm, Table} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {createField, dropField, modifyField} from '../../../api/model';
import FieldForm from "./FieldForm.tsx";
import {FieldInitialValues, FieldTypeMap} from "../common.ts";
import {Field, Model} from "../data";

interface FieldListProps {
  datasource: string;
  model: Model;
}

const FieldList: React.FC<FieldListProps> = ({datasource, model}) => {
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [changeDialogVisible, setChangeDialogVisible] = useState<boolean>(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number>(-1);
  const [currentVal, setCurrentVal] = useState<Field>(FieldInitialValues['string']);

  const fetchFields = useCallback(async () => {
    // Replace this with actual fetch call
    // const res = await getFields(datasource, model?.name);
    setFieldList(model?.fields);
  }, [datasource, model?.name]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleNewField = () => {
    setChangeDialogVisible(true);
    setSelectedFieldIndex(-1);
    setCurrentVal(FieldInitialValues['string']);
  };

  const handleEdit = (index: number) => {
    setSelectedFieldIndex(index);
    setCurrentVal(fieldList[index]);
    setChangeDialogVisible(true);
  };

  const addOrEditField = async (values: Field) => {
    try {
      if (selectedFieldIndex === -1) {
        await createField(datasource, model?.name, values);
        setFieldList([...fieldList, values]);
      } else {
        await modifyField(datasource, model?.name, values.name, values);
        const updatedFields = [...fieldList];
        updatedFields[selectedFieldIndex] = values;
        setFieldList(updatedFields);
      }
      setChangeDialogVisible(false);
      notification.success({message: 'Field saved successfully'});
    } catch (error) {
      console.log(error)
      notification.error({message: 'Failed to save field'});
    }
  };

  const delField = async (index: number) => {
    try {
      const field = fieldList[index];
      await dropField(datasource, model?.name, field.name);
      setFieldList(fieldList.filter((_, i) => i !== index));
      notification.success({message: 'Field deleted successfully'});
    } catch (error) {
      console.log(error)
      notification.error({message: 'Failed to delete field'});
    }
  };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, f: Field) => {
        if (type === 'id') {
          return 'ID';
        }
        if (type === 'relation') {
          return f?.targetEntity;
        }
        return FieldTypeMap[type]
      },
    },
    {
      title: 'Unique', dataIndex: 'unique', key: 'unique', render: (unique: boolean) => (unique ? 'Yes' : 'No')
    },
    {
      title: 'Nullable', dataIndex: 'nullable', key: 'nullable', render: (unique: boolean) => (unique ? 'Yes' : 'No')
    },
    {title: 'Comment', dataIndex: 'comment', key: 'comment'},
    {
      title: 'Operations',
      key: 'operations',
      render: (_: any, _record: Field, index: number) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined/>}
            onClick={() => handleEdit(index)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this field?"
            onConfirm={() => delField(index)}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined/>}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{padding: '20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          {model?.name} {model?.comment}
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          onClick={handleNewField}
        >
          New Field
        </Button>
      </div>
      <div style={{marginTop: 16}}>
        <Table
          size="small"
          rowKey="name"
          dataSource={fieldList}
          columns={columns}
          pagination={false}
          style={{width: '100%'}}
        />
      </div>
      <FieldForm
        visible={changeDialogVisible}
        datasource={datasource}
        model={model}
        currentValue={currentVal}
        onConfirm={addOrEditField}
        onCancel={() => setChangeDialogVisible(false)}
      />
    </div>
  );
};

export default FieldList;
