import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  notification,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { createField, dropField, modifyField } from "@/services/model.ts";
import FieldForm, { FieldInitialValues } from "./FieldForm.tsx";
import { Entity, Field, TypedFieldSchema } from "@/types/data-modeling";
import { useTranslation } from "react-i18next";

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
    setCurrentVal(FieldInitialValues["STRING"]);
  };

  const handleEdit = (index: number) => {
    setSelectedFieldIndex(index);
    setCurrentVal(fieldList[index]);
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
        concreteType: values.concreteType,
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
      notification.success({ message: t("form_save_success") });
    } catch (error) {
      console.log(error);
      notification.error({ message: t("form_save_failed") });
    }
  };

  const delField = async (index: number) => {
    try {
      const field = fieldList[index];
      await dropField(datasource, model?.name, field.name);
      setFieldList(fieldList.filter((_, i) => i !== index));
      notification.success({ message: t("field_delete_success") });
    } catch (error) {
      console.log(error);
      notification.error({ message: t("field_delete_failed") });
    }
  };

  const columns = [
    { title: t("name"), dataIndex: "name", key: "name" },
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
        if (type === "Enum") {
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
      render: (value: any) => JSON.stringify(value),
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
    <Card
      size="small"
      className="overflow-auto"
      bodyStyle={{ padding: 12 }}
      style={{ maxHeight: "calc(100vh - 180px)" }}
    >
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
    </Card>
  );
};

export default FieldList;
