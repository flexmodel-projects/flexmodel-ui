import React from "react";
import {theme} from "antd";

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  extra,
  style,
  className,
  loading = false,
}) => {
  const { token } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    height: 'calc(100vh - 60px)',
    width: '100%',
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorder}`,
    boxShadow: token.boxShadow,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {(title || extra) && (
        <div
          style={{
            padding: `${token.padding}px ${token.paddingLG}px`,
            borderBottom: `1px solid ${token.colorBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {title && (
            <h3 style={{ margin: 0, fontSize: token.fontSizeLG, fontWeight: token.fontWeightStrong }}>
              {title}
            </h3>
          )}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div
        style={{
          flex: 1,
          padding: token.padding,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div>加载中...</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default PageContainer;
