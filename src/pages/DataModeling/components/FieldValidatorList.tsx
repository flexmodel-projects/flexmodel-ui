import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Input, Menu} from 'antd';
import {CloseOutlined, DownOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {ValidatorTypes} from "../common.ts";
import FieldValidatorModal from "./FieldValidatorModal.tsx"; // 假设 ValidatorTypes 是预定义的验证器类型

interface FieldProps {
  datasource: any;
  model: any;
  field: {
    type: string;
  };
}

const FieldValidatorList: React.FC<FieldProps> = ({datasource, model, field}) => {
  const [list, setList] = useState<any[]>([]);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [form, setForm] = useState<any>({});
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 根据字段类型过滤验证器类型
  const filteredValidatorTypes = ValidatorTypes[field?.type] || [];

  // 处理下拉菜单命令
  const handleCommand = (command: string) => {
    setForm({type: command});
    setDialogVisible(true);
  };

  // 显示每个验证器的值
  const displayValue = (item: any) => `${item.type}: ${JSON.stringify(item)}`;

  // 删除指定索引的验证器
  const delItem = (index: number) => {
    setList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // 编辑指定索引的验证器
  const editItem = (index: number) => {
    setSelectedIndex(index);
    setForm(list[index]);
    setDialogVisible(true);
  };

  // 表单改变时处理验证器列表的更新
  const handleChange = (item: any) => {
    setDialogVisible(false);
    if (selectedIndex === null) {
      setList((prevList) => [...prevList, item]);
    } else {
      setList((prevList) =>
        prevList.map((val, idx) => (idx === selectedIndex ? item : val))
      );
    }
  };

  useEffect(() => {
    // 当 field.type 发生变化时，重置 list
    if (field?.type) {
      setList([]);
    }
  }, [field]);

  return (
    <div>
      {list.map((item, index) => (
        <Input
          key={index}
          className="mb-12px"
          value={displayValue(item)}
          readOnly
          suffix={
            <>
              <CloseOutlined
                className="mr-6px cursor-pointer hover:text-primary"
                onClick={() => delItem(index)}
              />
              <EditOutlined
                className="cursor-pointer hover:text-primary"
                onClick={() => editItem(index)}
              />
            </>
          }
        />
      ))}

      <Dropdown
        overlay={
          <Menu onClick={({key}) => handleCommand(key)}>
            {filteredValidatorTypes.map((item: any) => (
              <Menu.Item key={item.name}>{item.label}</Menu.Item>
            ))}
          </Menu>
        }
        trigger={['click']}
      >
        <Button icon={<PlusOutlined/>}>
          <DownOutlined/>
        </Button>
      </Dropdown>

      <FieldValidatorModal
        visible={dialogVisible}
        currentValue={form}
        field={field}
        onCancel={() => setDialogVisible(false)}
        onChange={handleChange} datasource={datasource} model={model} type={field.type}/>
    </div>
  );
};

export default FieldValidatorList;
