import React from "react";
import {Card, Col, Row, theme} from "antd";
import {DatabaseOutlined, FlagOutlined, HourglassOutlined, RocketOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

// 添加CSS动画样式
const animationStyles = `
  @keyframes backgroundFloat {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-12px) rotate(15deg);
    }
  }
`;

// 注入样式
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = animationStyles;
  if (!document.head.querySelector('style[data-statistics-animations]')) {
    styleSheet.setAttribute('data-statistics-animations', 'true');
    document.head.appendChild(styleSheet);
  }
}

// 统计卡片组件接口
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

// 统计卡片组件
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card
      styles={{
        body: {
          padding: '24px',
          background: `linear-gradient(135deg, ${color}40, ${color}25)`,
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden'
        }
      }}
      style={{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        borderRadius: '16px'
      }}
       onMouseEnter={(e) => {
         e.currentTarget.style.transform = 'translateY(-1px)';
         e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
       }}
       onMouseLeave={(e) => {
         e.currentTarget.style.transform = 'translateY(0)';
         e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.08)';
       }}
    >
      {/* 装饰性背景元素 */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}50, ${color}30)`,
        opacity: 0.9,
        animation: 'backgroundFloat 3s ease-in-out infinite'
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        padding: '8px 0'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          boxShadow: `0 4px 12px ${color}30`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {icon}
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'var(--ant-color-text-secondary)',
            fontWeight: 500,
            lineHeight: 1.4,
            letterSpacing: '0.5px'
          }}>{title}</div>
          <div style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--ant-color-text)',
            lineHeight: 1.2,
          }}>{value}</div>
        </div>
      </div>
    </Card>
  );
};

// 统计数据接口
interface Statistics {
  queryCount: number;
  mutationCount: number;
  subscribeCount: number;
  dataSourceCount: number;
}

// 统计卡片组接口
interface StatisticsCardsProps {
  stats: Statistics;
}

// 统计卡片组组件
const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title={t("query")}
          value={stats.queryCount}
          icon={<HourglassOutlined style={{ fontSize: '32px', color: '#ffffff' }} />}
          color={token.colorPrimary}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title={t("mutation")}
          value={stats.mutationCount}
          icon={<FlagOutlined style={{ fontSize: '32px', color: '#ffffff' }} />}
          color={token.colorSuccess}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title={t("subscription")}
          value={stats.subscribeCount}
          icon={<RocketOutlined style={{ fontSize: '32px', color: '#ffffff' }} />}
          color={token.colorError}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title={t("datasource")}
          value={stats.dataSourceCount}
          icon={<DatabaseOutlined style={{ fontSize: '32px', color: '#ffffff' }} />}
          color={token.colorInfo}
        />
      </Col>
    </Row>
  );
};

export default StatisticsCards;
