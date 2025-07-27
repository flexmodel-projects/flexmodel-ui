import React, {useState} from 'react';
import {Button, Typography} from 'antd';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';

interface SensitiveTextProps {
  text: string | undefined;
}

const SensitiveText: React.FC<SensitiveTextProps> = ({text}) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  const toggleHide = () => {
    setIsHide(!isHide);
  };

  return (
    <div>
      <Typography.Text>
        {isHide ? '***********' : text}
      </Typography.Text>
      <Button
        type="link"
        icon={isHide ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
        onClick={toggleHide}
      />
    </div>
  );
};

export default SensitiveText;
