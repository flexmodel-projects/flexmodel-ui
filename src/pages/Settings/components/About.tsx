import React from 'react';
import {Typography} from 'antd';
import {useTranslation} from "react-i18next";

const {Title, Paragraph} = Typography;

const About: React.FC = () => {
  const {t} = useTranslation();
  return (
    <div style={{textAlign: 'center', marginTop: '20px'}}>
      <div className="logo" style={{justifySelf: 'center'}}>
        <img style={{width: '80px'}} src="/logo.png" alt="Flexmodel Logo"/>
      </div>
      <Title level={3} className="description">
        Flexmodel | {t('app_description')}
      </Title>
      <div style={{marginTop: '10px'}}>
        <div style={{width: '100%', padding: '16px', textAlign: 'center'}}>
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
