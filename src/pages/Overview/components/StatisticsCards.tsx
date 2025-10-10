import React from "react";
import {Card, Col, Row, theme} from "antd";
import {ApiOutlined, ClockCircleOutlined, DatabaseOutlined, NodeIndexOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";


// 统计数据接口
interface Statistics {
  queryCount: number;
  mutationCount: number;
  subscribeCount: number;
  requestCount: number;
  dataSourceCount: number;
  modelCount: number;
  flowDefCount: number;
  flowExecCount: number;
  triggerTotalCount: number;
  jobSuccessCount: number;
  jobFailureCount: number;
}

// 统计卡片组接口
interface StatisticsCardsProps {
  stats: Statistics;
}

// 通用卡片组件
const StatCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}> = ({ title, icon, color, children }) => {
  return (
    <Card
      hoverable
      styles={{
        body: {
          padding: '20px',
        }
      }}
    >

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 图标 */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: `${color}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}>
          {icon}
        </div>

        {/* 内容区域 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '4px'
        }}>
          {/* 标题 */}
          <div style={{
            fontSize: '16px',
            color: 'var(--ant-color-text-secondary)',
            fontWeight: 500,
            lineHeight: 1.3,
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {title}
          </div>

          {/* 内容 */}
          {children}
        </div>
      </div>
    </Card>
  );
};

// API信息卡片组件
const ApiInfoCard: React.FC<{ stats: Statistics; color: string }> = ({ stats, color }) => {
  const { t } = useTranslation();

  return (
    <StatCard
      title={t("api")}
      icon={<ApiOutlined style={{ fontSize: '24px', color: '#ffffff' }} />}
      color={color}
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("query")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.queryCount}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("mutation")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.mutationCount}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("subscription")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.subscribeCount}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("request_count")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.requestCount}
          </div>
        </div>
      </div>
    </StatCard>
  );
};

// 服务编排卡片组件
const FlowOrchestrationCard: React.FC<{ stats: Statistics; color: string }> = ({ stats, color }) => {
  const { t } = useTranslation();

  return (
    <StatCard
      title={t("flow")}
      icon={<NodeIndexOutlined style={{ fontSize: '24px', color: '#ffffff' }} />}
      color={color}
    >
      <div style={{
        display: 'flex',
        gap: '3px',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("flow_count")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.flowDefCount}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("exec_count")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-success)' }}>
            {stats.flowExecCount}
          </div>
        </div>
      </div>
    </StatCard>
  );
};

// 任务调度卡片组件
const TaskSchedulingCard: React.FC<{ stats: Statistics; color: string }> = ({ stats, color }) => {
  const { t } = useTranslation();

  return (
    <StatCard
      title={t("schedule")}
      icon={<ClockCircleOutlined style={{ fontSize: '24px', color: '#ffffff' }} />}
      color={color}
    >
      <div style={{
        display: 'flex',
        gap: '3px',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("trigger_count")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.triggerTotalCount}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("exec_success")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-success)' }}>
            {stats.jobSuccessCount}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("exec_failure")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-error)' }}>
            {stats.jobFailureCount}
          </div>
        </div>
      </div>
    </StatCard>
  );
};

// 数据卡片组件
const DataCard: React.FC<{ stats: Statistics; color: string }> = ({ stats, color }) => {
  const { t } = useTranslation();

  return (
    <StatCard
      title={t("data")}
      icon={<DatabaseOutlined style={{ fontSize: '24px', color: '#ffffff' }} />}
      color={color}
    >
      <div style={{
        display: 'flex',
        gap: '3px',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("datasource")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.dataSourceCount}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '45px' }}>
          <div style={{ fontSize: '10px', color: 'var(--ant-color-text-secondary)', marginBottom: '1px' }}>
            {t("model_count")}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ant-color-text)' }}>
            {stats.modelCount}
          </div>
        </div>
      </div>
    </StatCard>
  );
};

// 统计卡片组组件
const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  const { token } = theme.useToken();

  return (
    <Row gutter={[8, 8]} style={{ marginBottom: '8px'}}>
      <Col xs={24} sm={12} lg={6}>
        <ApiInfoCard
          stats={stats}
          color={token.colorPrimary}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <DataCard
          stats={stats}
          color={token.colorSuccess}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <FlowOrchestrationCard
          stats={stats}
          color="#8B5CF6"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <TaskSchedulingCard
          stats={stats}
          color="#EC4899"
        />
      </Col>

    </Row>
  );
};

export default StatisticsCards;
