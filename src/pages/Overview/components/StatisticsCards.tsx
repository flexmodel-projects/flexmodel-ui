import React from "react";
import {Card, Col, Row, theme} from "antd";
import {DatabaseOutlined, FlagOutlined, HourglassOutlined, RocketOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

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
          padding: '20px'
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        height: '100%'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          backgroundColor: color
        }}>
          {icon}
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'var(--ant-color-text-secondary)',
            fontWeight: 500,
            lineHeight: 1.4
          }}>{title}</div>
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--ant-color-text)',
            lineHeight: 1.2
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
    <Row gutter={12}>
      <Col span={6}>
        <StatCard
          title={t("query")}
          value={stats.queryCount}
          icon={<HourglassOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />}
          color={token.colorPrimaryBg}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title={t("mutation")}
          value={stats.mutationCount}
          icon={<FlagOutlined style={{ fontSize: '24px', color: token.colorSuccess }} />}
          color={token.colorSuccessBg}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title={t("subscription")}
          value={stats.subscribeCount}
          icon={<RocketOutlined style={{ fontSize: '24px', color: token.colorError }} />}
          color={token.colorErrorBg}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title={t("datasource")}
          value={stats.dataSourceCount}
          icon={<DatabaseOutlined style={{ fontSize: '24px', color: token.colorInfo }} />}
          color={token.colorInfoBg}
        />
      </Col>
    </Row>
  );
};

export default StatisticsCards;
