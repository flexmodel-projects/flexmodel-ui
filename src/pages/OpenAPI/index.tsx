import React from 'react';
import {useTheme} from '@/store/appStore';
import PageContainer from '@/components/common/PageContainer';

const OpenAPI: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <PageContainer>
      <iframe
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flex: 1
        }}
        src={`${import.meta.env.BASE_URL}/rapi-doc/index.html?theme=${isDark ? 'dark' : 'light'}`}
        title="Rapi Doc"
      />
    </PageContainer>
  );
};

export default OpenAPI;
