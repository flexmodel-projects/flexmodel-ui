import React, { useEffect, useRef, useState } from 'react';
import { Input } from 'antd';

interface HoverEditInputProps {
  value: string;
  onChange: (value: string) => void;
}

const HoverEditInput: React.FC<HoverEditInputProps> = ({ value, onChange }) => {
  const [val, setVal] = useState<string>(value);
  const inputRef = useRef<any>(null);

  const handleKeyEnter = () => {
    onChange(val);
  };

  useEffect(() => {
    if (val) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [val]);

  return (
    <Input
      ref={inputRef}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onPressEnter={handleKeyEnter}
      size="small"
    />
  );
};

export default HoverEditInput;
