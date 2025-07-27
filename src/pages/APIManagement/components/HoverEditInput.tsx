import React, {useEffect, useRef, useState} from 'react';
import {Input} from 'antd';

interface HoverEditInputProps {
  value: string;
  onChange: (value: string) => void;
}

const HoverEditInput: React.FC<HoverEditInputProps> = ({value, onChange}) => {
  const [val, setVal] = useState<string>(value);
  const inputRef = useRef<any>(null);

  const handleKeyEnter = () => {
    onChange(val);
  };

  useEffect(() => {
    inputRef.current?.select();
  }, [value]);

  useEffect(() => {
    if (val) {
      inputRef.current?.focus();
    }
  }, [val]);

  return (
    <Input
      ref={inputRef}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onPressEnter={handleKeyEnter}
    />
  );
};

export default HoverEditInput;
