import React, { useState, useEffect, useCallback } from 'react';
import { Button, Dropdown, Menu, Input, Modal, Select } from 'antd';
import { PlusOutlined, EditOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import { GeneratorTypes } from './types';
import FieldGeneratorModal from "./FieldGeneratorModal.tsx";

interface Props {
  datasource: string;
  model: any;
  field: any;
}

const ValueManager: React.FC<Props> = ({ datasource, model, field }) => {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [form, setForm] = useState<any>({});
  const [list, setList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredGeneratorTypes = GeneratorTypes[field?.type] || [];

  const handleCommand = useCallback((command: string) => {
    setForm({ type: command, generationTime: 'INSERT' });
    setDialogVisible(true);
  }, []);

  const handleChange = (item: any) => {
    setDialogVisible(false);
    setList([item]);
    setSelectedItem(item);
  };

  const displayValue = (item: any) => {
    return `${item.type}: ${JSON.stringify(item)}`;
  };

  const addItem = () => {
    setForm({});
    setDialogVisible(true);
  };

  const delItem = (index: number) => {
    setList([]);
    setSelectedItem(null);
  };

  const editItem = (item: any) => {
    setForm(item);
    setDialogVisible(true);
  };

  const handleDropdownMenuClick = (e: any) => {
    handleCommand(e.key);
  };

  useEffect(() => {
    if (field?.type) {
      setList([]);
    }
  }, [field]);

  useEffect(() => {
    if (selectedItem) {
      setList([selectedItem]);
    }
  }, [selectedItem]);

  return (
    <>
      {list.map((item, index) => (
        <Input
          key={index}
          className="mb-12px"
          readOnly
          value={displayValue(item)}
          suffix={
            <>
              <CloseOutlined
                className="mr-6px cursor-pointer hover:text-primary"
                onClick={() => delItem(index)}
              />
              <EditOutlined
                className="cursor-pointer hover:text-primary"
                onClick={() => editItem(item)}
              />
            </>
          }
        />
      ))}

      {list.length < 1 && (
        <Dropdown
          overlay={
            <Menu onClick={handleDropdownMenuClick}>
              {filteredGeneratorTypes.map((item) => (
                <Menu.Item key={item.name}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          }
          trigger={['click']}
        >
          <Button icon={<PlusOutlined />}>
            <DownOutlined className="hover:text-primary" />
          </Button>
        </Dropdown>
      )}

      <FieldGeneratorModal
        currentValue={form}
        visible={dialogVisible}
        onCancel={() => setDialogVisible(false)}
        onChange={handleChange}
        field={field} datasource={''} model={undefined} type={field.type}
      />
    </>
  );
};

export default ValueManager;
