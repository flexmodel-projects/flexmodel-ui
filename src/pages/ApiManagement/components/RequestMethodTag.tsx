import React from 'react';

interface RequestMethodTagProps {
  method: string;
}

const RequestMethodTag: React.FC<RequestMethodTagProps> = ({ method }) => {
  const getMethodStyle = (method: string): React.CSSProperties => {
    switch (method) {
      case 'GET':
        return { color: 'green' };
      case 'POST':
        return { color: 'goldenrod' };
      case 'PUT':
        return { color: 'mediumblue' };
      case 'DELETE':
        return { color: 'red' };
      default:
        return {};
    }
  };

  const getMethodLabel = (method: string): string => {
    switch (method) {
      case 'DELETE':
        return 'DEL';
      case 'PUT':
        return 'PUT';
      case 'GET':
        return 'GET';
      case 'POST':
        return 'POST';
      default:
        return method;
    }
  };

  return (
    <div className="tree-item-icon" style={{ textAlign: 'right', fontWeight: 'bold' }}>
      <span style={getMethodStyle(method)}>
        {method === 'GET' || method === 'PUT' || method === 'DELETE' ? `\u00A0\u00A0${getMethodLabel(method)}` : getMethodLabel(method)}
      </span>
    </div>
  );
};

export default RequestMethodTag;
