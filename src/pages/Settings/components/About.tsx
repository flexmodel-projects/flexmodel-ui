import React from 'react';
import {Card, Typography} from 'antd';
import {useTranslation} from "react-i18next";

const {Title, Paragraph} = Typography;

const About: React.FC = () => {
  const {t} = useTranslation();
  return (
    <Card>
      <div className="logo" style={{justifySelf: 'center',padding: '60px'}}>
        <img style={{width: '80px'}} src={`${import.meta.env.BASE_URL}/logo.png`} alt="Flexmodel Logo"/>
      </div>
      <Title level={3}>
        Flexmodel | {t('app_description')}
      </Title>
      <div style={{marginTop: '10px'}}>
        <div style={{width: '100%', padding: '16px', textAlign: 'center'}}>
          <Paragraph style={{ color: 'var(--ant-color-text)' }}>
            See{' '}
            <a href="https://github.com/flexmodel-projects" target="_blank" rel="noopener noreferrer">
              flexmodel projects
            </a>{' '}
            for more information.
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export default About;
