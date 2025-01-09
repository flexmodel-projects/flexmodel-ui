import React, {useCallback, useEffect, useState} from 'react';
import {Button, notification, Popconfirm, Table} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {createField, dropField, modifyField} from '../../../api/model';
import FieldForm from "./FieldForm.tsx";
import {FieldInitialValues, FieldTypeMap} from "../common.ts";
import {Entity, Field} from "../data";
import {useTranslation} from "react-i18next";

interface FieldListProps {
  datasource: string;
  model: Entity;
}

const FieldList: React.FC<FieldListProps> = ({datasource, model}) => {
  const {t} = useTranslation();
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
      notification.success({message: t('form_save_success')});
    } catch (error) {
      console.log(error)
      notification.error({message: t('form_save_failed')});
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
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {
      title: t('type'),
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
      title: t('default_value'),
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      render: (value: boolean) => value?.toString(),
    },
    {
      title: t('unique'),
      dataIndex: 'unique',
      key: 'unique',
      render: (value: boolean) => (value ? t('yes') : t('no'))
    },
    {
      title: t('nullable'),
      dataIndex: 'nullable',
      key: 'nullable',
      render: (value: boolean) => (value ? t('yes') : t('no'))
    },
    {title: t('comment'), dataIndex: 'comment', key: 'comment'},
    {
      title: t('operations'),
      key: 'operations',
      render: (_: any, _record: Field, index: number) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined/>}
            onClick={() => handleEdit(index)}
          >
            {t('edit')}
          </Button>
          <Popconfirm
            title={t('table_selection_delete_text')}
            onConfirm={() => delField(index)}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined/>}
            >
              {t('delete')}
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
          {t('new_field')}
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
