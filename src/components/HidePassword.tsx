import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface HidePasswordProps {
  text: string;
}

const HidePassword: React.FC<HidePasswordProps> = ({ text }) => {
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
        icon={isHide ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={toggleHide}
      />
    </div>
  );
};

export default HidePassword;
