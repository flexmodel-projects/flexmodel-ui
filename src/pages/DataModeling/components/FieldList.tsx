import React, {useCallback, useEffect, useState} from "react";
import {Button, message, Popconfirm, Space, Table, Tooltip,} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  KeyOutlined,
  LinkOutlined,
  NumberOutlined,
  PlusOutlined,
  TagsOutlined
} from "@ant-design/icons";
import {createField, dropField, modifyField} from "@/services/model.ts";
import FieldForm, {FieldInitialValues} from "./FieldForm.tsx";
import {Entity, Field, TypedFieldSchema} from "@/types/data-modeling";
import {useTranslation} from "react-i18next";

interface FieldListProps {
  datasource: string;
  model: Entity;
}

const FieldList: React.FC<FieldListProps> = ({ datasource, model }) => {
  const { t } = useTranslation();
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [changeDialogVisible, setChangeDialogVisible] =
    useState<boolean>(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number>(-1);
  const [currentVal, setCurrentVal] = useState<Field>(
    FieldInitialValues["STRING"]
  );

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
    setCurrentVal({
      ...FieldInitialValues["STRING"],
      tmpType: "String"
    });
  };

  const handleEdit = (index: number) => {
    const field = fieldList[index];
    setSelectedFieldIndex(index);

    // 根据字段类型正确设置tmpType
    let tmpTypeValue = field.tmpType;
    if (!tmpTypeValue) {
      if (field.type === 'Relation' && field.from) {
        tmpTypeValue = `Relation:${field.from}`;
      } else if (field.type === 'Enum' && field.from) {
        tmpTypeValue = `Enum:${field.from}`;
      } else {
        tmpTypeValue = field.type;
      }
    }

    setCurrentVal({
      ...field,
      tmpType: tmpTypeValue
    });
    setChangeDialogVisible(true);
  };

  const addOrEditField = async (values: Field) => {
    try {
      const typedField: TypedFieldSchema = {
        name: values.name,
        type: values.type,
        unique: values.unique ?? false,
        nullable: values.nullable ?? false,
        comment: values.comment,
        defaultValue: values.defaultValue,
        modelName: model?.name,
        identity: values.identity ?? false,
      };
      if (selectedFieldIndex === -1) {
        const res = await createField(datasource, model?.name, typedField);
        setFieldList([...fieldList, res as unknown as Field]);
      } else {
        await modifyField(datasource, model?.name, values.name, typedField);
        const updatedFields = [...fieldList];
        updatedFields[selectedFieldIndex] = values;
        setFieldList(updatedFields);
      }
      setChangeDialogVisible(false);
      message.success(t("form_save_success"));
    } catch (error) {
      console.log(error);
      message.error(t("form_save_failed"));
    }
  };

  const delField = async (index: number) => {
    try {
      const field = fieldList[index];
      await dropField(datasource, model?.name, field.name);
      setFieldList(fieldList.filter((_, i) => i !== index));
      message.success(t("field_delete_success"));
    } catch (error) {
      console.log(error);
      message.error(t("field_delete_failed"));
    }
  };

  // 根据字段类型获取对应的图标
  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'String':
        return <FontSizeOutlined style={{ color: '#1890ff', marginRight: 4 }} />;
      case 'Int':
      case 'Long':
      case 'Float':
      case 'Decimal':
        return <NumberOutlined style={{ color: '#52c41a', marginRight: 4 }} />;
      case 'Boolean':
        return <CheckCircleOutlined style={{ color: '#722ed1', marginRight: 4 }} />;
      case 'Date':
        return <CalendarOutlined style={{ color: '#13c2c2', marginRight: 4 }} />;
      case 'Time':
        return <ClockCircleOutlined style={{ color: '#eb2f96', marginRight: 4 }} />;
      case 'DateTime':
        return <CalendarOutlined style={{ color: '#fa8c16', marginRight: 4 }} />;
      case 'JSON':
        return <FileTextOutlined style={{ color: '#f5222d', marginRight: 4 }} />;
      case 'Relation':
        return <LinkOutlined style={{ color: '#2f54eb', marginRight: 4 }} />;
      case 'EnumRef':
        return <TagsOutlined style={{ color: '#fa541c', marginRight: 4 }} />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Field) => (
        <span>
          {record.identity ? (
            <KeyOutlined
              style={{ color: '#faad14', marginRight: 4 }}
              title={t("identity_field")}
            />
          ) : (
            getFieldTypeIcon(record.type)
          )}
          {name}
        </span>
      )
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (type: string, f: Field) => {
        if (type === "Relation") {
          return (
            <Tooltip
              title={
                <span>
                  {t("local_field")}: {f?.localField + ""}
                  <br />
                  {t("foreign_field")}: {f?.foreignField + ""}
                  <br />
                  {t("cascade_delete")}: {f?.cascadeDelete + ""}
                </span>
              }
            >
              {f.concreteType}
            </Tooltip>
          );
        }
        if (type === "EnumRef") {
          return (
            <Tooltip title={<span>{t("enums")}</span>}>
              {f.concreteType}
            </Tooltip>
          );
        }
        return type;
      },
    },
    {
      title: t("default_value"),
      dataIndex: "defaultValue",
      key: "defaultValue",
      render: (value: { type: "generated" | "fixed"; value: string | number | boolean | null; name: string | null; } | undefined) => {
        if (!value) return '-';
        if (value.type === 'fixed') {
          return value.value !== null ? value.value : 'null';
        }
        if (value.type === 'generated') {
          return value.name ? `Generated: ${value.name}` : 'Generated';
        }
        return '-';
      },
    },
    {
      title: t("unique"),
      dataIndex: "unique",
      key: "unique",
      render: (value: boolean) => (value ? t("yes") : t("no")),
    },
    {
      title: t("nullable"),
      dataIndex: "nullable",
      key: "nullable",
      render: (value: boolean) => (value ? t("yes") : t("no")),
    },
    { title: t("comment"), dataIndex: "comment", key: "comment" },
    {
      title: t("operations"),
      key: "operations",
      render: (_: any, _record: Field, index: number) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(index)}
            size="small"
          >
            {t("edit")}
          </Button>
          <Popconfirm
            title={t("table_selection_delete_text")}
            onConfirm={() => delField(index)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              {t("delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewField}
          size="small"
        >
          {t("new_field")}
        </Button>
      </div>
      <Table
        rowKey={(record, index) => `${record.name}-${index}`}
        scroll={{ y: 450 }}
        dataSource={fieldList}
        columns={columns}
        pagination={false}
      />
      <FieldForm
        visible={changeDialogVisible}
        datasource={datasource}
        model={model}
        currentValue={currentVal}
        onConfirm={addOrEditField}
        onCancel={() => setChangeDialogVisible(false)}
      />
    </>
  );
};

export default FieldList;
