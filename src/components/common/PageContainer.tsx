import React from "react";
import {theme, Typography} from "antd";
import {useTranslation} from "react-i18next";

interface PageContainerProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
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
  const { t } = useTranslation();

  const containerStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorderSecondary}`,
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
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {title && (
            <Typography.Title style={{ margin: 0 }} level={5}>
              {typeof title === 'string' ? title : title}
            </Typography.Title>
          )}
          {extra && extra}
        </div>
      )}
      <div
        className="page-content"
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
            <div>{t('loading')}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default PageContainer;
