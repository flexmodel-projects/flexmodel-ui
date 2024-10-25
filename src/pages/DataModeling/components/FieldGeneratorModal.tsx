import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Select} from 'antd';
import {GenerationTimes} from "../common.ts";
import FieldInput from "./FieldInput.tsx";

interface Props {
  visible: boolean;
  datasource: string;
  model: any;
  field: any;
  type: string;
  currentValue: any;
  onChange: (value: any) => void;
  onCancel: () => void;
}

const FieldGeneratorModal: React.FC<Props> = ({
                                                visible,
                                                field,
                                                type,
                                                currentValue,
                                                onChange,
                                                onCancel,
                                              }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<any>({});

  useEffect(() => {
    if (currentValue) {
      setFormValues(currentValue);
      form.setFieldsValue(currentValue);
    }
  }, [currentValue, form]);

  const handleSubmit = () => {
    onChange(formValues);
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      title={type}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Confirm
        </Button>,
      ]}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={formValues}
        onValuesChange={(_, values) => setFormValues(values)}
      >
        {type === 'FixedValueGenerator' && (
          <Form.Item
            label="Fixed value"
            name="value"
            rules={[{required: true, message: 'Please input the fixed value!'}]}
          >
            <FieldInput field={field} value={undefined} onChange={function (val: any): void {
              console.log(val)
            }}/>
          </Form.Item>
        )}
        <Form.Item
          label="Generation time"
          name="generationTime"
          rules={[{required: true, message: 'Please select the generation time!'}]}
        >
          <Select>
            {GenerationTimes.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldGeneratorModal;
