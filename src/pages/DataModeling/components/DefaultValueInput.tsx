import React, {useEffect, useState} from 'react';
import {Input, Select, theme} from 'antd';
import {useTranslation} from 'react-i18next';
import FieldInput from './FieldInput';
import {Field} from '@/types/data-modeling';

interface DefaultValueInputProps {
  fieldFn: () => Field;
  value: any;
  onChange: (val: any) => void;
  modelList?: any[];
}

const DefaultValueInput: React.FC<DefaultValueInputProps> = ({
  fieldFn,
  value,
  onChange,
  modelList = [],
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  // const field = fieldFn(); // 暂时未使用，但保留以备将来扩展

  const [defaultValueType, setDefaultValueType] = useState<'fixed' | 'generated'>('fixed');
  const [fixedValue, setFixedValue] = useState<any>(null);
  const [generatedName, setGeneratedName] = useState<string>('');

  const inputStyle = {
    fontSize: token.fontSizeSM,
  };

  // 初始化值
  useEffect(() => {
    if (value) {
      if (value.type === 'fixed') {
        setDefaultValueType('fixed');
        setFixedValue(value.value);
      } else if (value.type === 'generated') {
        setDefaultValueType('generated');
        setGeneratedName(value.name || '');
      }
    } else {
      setDefaultValueType('fixed');
      setFixedValue(null);
      setGeneratedName('');
    }
  }, [value]);

  // 处理类型变化
  const handleTypeChange = (type: 'fixed' | 'generated') => {
    setDefaultValueType(type);
    if (type === 'fixed') {
      onChange({ type: 'fixed', value: null });
    } else {
      onChange({ type: 'generated', name: '' });
    }
  };

  // 处理固定值变化
  const handleFixedValueChange = (val: any) => {
    setFixedValue(val);
    onChange({ type: 'fixed', value: val });
  };

  // 处理生成值名称变化
  const handleGeneratedNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setGeneratedName(name);
    onChange({ type: 'generated', name });
  };

  return (
    <div style={{ width: '100%', display: 'flex', gap: 8, alignItems: 'center' }}>
      <Select
        value={defaultValueType}
        onChange={handleTypeChange}
        style={{ width: 120 }}
        options={[
          { value: 'fixed', label: t('default_value_fixed') },
          { value: 'generated', label: t('default_value_generated') }
        ]}
      />

      {defaultValueType === 'fixed' && (
        <div style={{ flex: 1 }}>
          <FieldInput
            fieldFn={fieldFn}
            value={fixedValue}
            onChange={handleFixedValueChange}
            modelList={modelList}
          />
        </div>
      )}

      {defaultValueType === 'generated' && (
        <div style={{ flex: 1 }}>
          <Input
            placeholder={t('default_value_generated_placeholder')}
            value={generatedName}
            onChange={handleGeneratedNameChange}
            style={inputStyle}
          />
        </div>
      )}
    </div>
  );
};

export default DefaultValueInput;
