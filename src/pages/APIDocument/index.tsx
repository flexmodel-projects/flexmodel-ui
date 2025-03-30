import React from 'react';

const SwaggerUI: React.FC = () => {
  return (
    <div style={{width: '100%', height: '100%', border: 'none'}}>
      <iframe
        style={{width: '100%', height: '100%', border: 'none'}}
        src={`${import.meta.env.BASE_URL}/rapi-doc/index.html`}
        title="Rapi Doc"
      />
    </div>

  );
};

export default SwaggerUI;
