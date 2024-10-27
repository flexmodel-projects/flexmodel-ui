import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div className="logo" style={{ justifySelf: 'center' }}>
        <img style={{ width: '80px' }} src="/logo.svg" alt="Flexmodel Logo" />
      </div>
      <Title level={3} className="description">
        Flexmodel | All-in-one API design platform
      </Title>
      <div style={{ marginTop: '10px' }}>
        <div style={{ width: '100%', padding: '16px', textAlign: 'center' }}>
          <Paragraph>
            See{' '}
            <a href="https://github.com/flexmodel-projects" target="_blank" rel="noopener noreferrer">
              flexmodel projects
            </a>{' '}
            for more information.
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default About;
