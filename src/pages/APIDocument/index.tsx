
import React from 'react';

const SwaggerUI: React.FC = () => {
  return (
    <div style={{width: '100%', height: '100%', border: 'none'}}>
      <iframe
        style={{width: '100%', height: '100%', border: 'none'}}
        src="/swagger-ui/index.html"
        title="Swagger UI"
      />
    </div>

  );
};

export default SwaggerUI;
