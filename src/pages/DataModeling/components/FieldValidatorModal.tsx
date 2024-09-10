import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal} from 'antd';
import FieldInput from './FieldInput';

interface FieldProps {
  currentValue?: any;
  datasource: any;
  model: any;
  type: string;
  field: {
    type: string;
  };
  visible: boolean;
  onChange: (value: any) => void;
  onCancel: () => void;
}

const FieldValidatorModal: React.FC<FieldProps> = ({
                                                     currentValue,
                                                     field,
                                                     visible,
                                                     onChange,
                                                     onCancel,
                                                   }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<any>({});

  useEffect(() => {
    if (currentValue) {
      form.setFieldsValue(currentValue);
      setFormValues(currentValue);
    }
  }, [currentValue, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onChange(values);
    });
  };

  const renderFormItems = () => {
    switch (field.type) {
      case 'string':
        return (
          <Form.Item
            name="regexp"
            label="Regexp"
            rules={[{required: true, message: 'Please input the regexp'}]}
          >
            <Input/>
          </Form.Item>
        );
      case 'int':
        return (
          <>
            {['NumberMinValidator', 'NumberRangeValidator'].includes(formValues.type) && (
              <Form.Item name="min" label="Min" rules={[{required: true}]}>
                <FieldInput
                  value={formValues.min}
                  field={field}
                  onChange={function (val: any): void {
                    console.log(val)
                  }}
                />
              </Form.Item>
            )}
            {['NumberMaxValidator', 'NumberRangeValidator'].includes(formValues.type) && (
              <Form.Item name="max" label="Max" rules={[{required: true}]}>
                <FieldInput
                  value={formValues.max}
                  field={field}
                  onChange={function (val: any): void {
                    console.log(val)
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      case 'datetime':
        return (
          <>
            {['DatetimeMinValidator', 'DatetimeRangeValidator'].includes(formValues.type) && (
              <Form.Item name="min" label="Min" rules={[{required: true}]}>
                <FieldInput
                  value={formValues.min}
                  field={field}
                  onChange={function (val: any): void {
                    console.log(val)
                  }}
                />
              </Form.Item>
            )}
            {['DatetimeMaxValidator', 'DatetimeRangeValidator'].includes(formValues.type) && (
              <Form.Item name="max" label="Max" rules={[{required: true}]}>
                <FieldInput
                  value={formValues.max}
                  field={field}
                  onChange={function (val: any): void {
                    console.log(val)
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      case 'date':
        return (
          <>
            {['DateMinValidator', 'DateRangeValidator'].includes(formValues.type) && (
              <Form.Item name="min" label="Min" rules={[{required: true}]}>
                <FieldInput
                  value={formValues.min}
                  field={field}
                  onChange={function (val: any): void {
                    console.log(val)
                  }}
                />
              </Form.Item>
            )}
            {['DateMaxValidator', 'DateRangeValidator'].includes(formValues.type) && (
              <Form.Item name="max" label="Max" rules={[{required: true}]}>
                <FieldInput
                  value={formValues.max}
                  field={field} onChange={function (val: any): void {
                  console.log(val)
                }}/>
              </Form.Item>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={formValues.type}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Confirm
        </Button>,
      ]}
    >
      <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}}>
        {renderFormItems()}

        <Form.Item name="message" label="Message">
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldValidatorModal;
