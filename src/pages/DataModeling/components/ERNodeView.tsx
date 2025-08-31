import React, {useEffect, useState} from 'react';
import {Entity} from '@/types/data-modeling';
import {KeyOutlined} from '@ant-design/icons';

interface ERNodeViewProps {
  entity: Entity;
}

const ERNodeView: React.FC<ERNodeViewProps> = ({ entity }) => {
  const [expanded, setExpanded] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const fields = entity.fields || [];
  const showFields = expanded ? fields : fields.slice(0, 5);
  const hasMore = fields.length > 5;

  return (
    <div
      style={{
        background: isDark ? '#23232a' : '#ffffff',
        border: ` ${isDark ? '#333842' : '#d9d9d9'}`,
        borderRadius: 4,
        minWidth: 220,
        minHeight: 40,
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '0px 16px 8px 16px',
        fontSize: 14,
        color: isDark ? '#e6e6e6' : '#333',
        position: 'relative',
        transition: 'box-shadow 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)')}
    >
      <div
        style={{
          fontWeight: 500,
          color: isDark ? '#fff' : '#333',
          marginBottom: 10,
          fontSize: 16,
          letterSpacing: 0.2,
          background: isDark ? '#18181c' : '#f5f5f5',
          padding: '8px 0',
          borderBottom: ` ${isDark ? '#333842' : '#d9d9d9'}`,
          marginLeft: '-16px',
          marginRight: '-16px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        {entity.name}
      </div>
      <div>
        {showFields.map((f, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
              fontSize: 14,
              color: isDark ? '#b5b5b5' : '#595959',
              borderBottom: idx !== showFields.length - 1 ? ` ${isDark ? '#23232a' : '#f0f0f0'}` : 'none',
            }}
          >
            <span style={{ 
              color: isDark ? '#36a3f7' : '#1890ff', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center'
            }}>
              {f.identity && <KeyOutlined style={{ marginRight: 4, fontSize: 12 }} />}
              {f.name}
            </span>
            <span style={{ color: isDark ? '#8c8c8c' : '#8c8c8c', fontWeight: 400 }}>{f.concreteType || f.type}</span>
          </div>
        ))}
      </div>
      {hasMore && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => setExpanded(e => !e)}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 16,
              color: isDark ? '#36a3f7' : '#1890ff',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s',
              lineHeight: 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
              <polyline points="6 10 12 16 18 10" fill="none" stroke={isDark ? '#36a3f7' : '#1890ff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default ERNodeView;
