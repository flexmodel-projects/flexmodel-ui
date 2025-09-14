import React, {useEffect, useState} from "react";
import {Card, Col, Row, Spin, theme} from "antd";
import dayjs, {Dayjs} from "dayjs";
import {DatabaseOutlined, FlagOutlined, HourglassOutlined, RocketOutlined} from "@ant-design/icons";
import {getOverview} from "@/services/overview.ts";
import {useTranslation} from "react-i18next";
import styles from "@/pages/Overview/index.module.scss";
import type {ApiStat, OverviewResponse, RankingData, Statistics} from '@/types/overview.d.ts';
import TrendAnalysis from '@/components/common/TrendAnalysis';
import UnifiedMonitoring from "@/pages/Overview/components/metrics/UnifiedMonitoring.tsx";


// 自定义统计卡片组件
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card className={styles.statCardWrapper}>
      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className={styles.statContent}>
          <div className={styles.statTitle}>{title}</div>
          <div className={styles.statValue}>{value}</div>
        </div>
      </div>
    </Card>
  );
};

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Statistics>({
    queryCount: 0,
    mutationCount: 0,
    subscribeCount: 0,
    dataSourceCount: 0,
  });
  const [apiStat, setApiStat] = useState<ApiStat>({
    dateList: [],
    successData: [],
    failData: [],
  });
  const [rankingData, setRankingData] = useState<RankingData[]>([]);

  // 默认日期范围设置为本周
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("week"),
    dayjs().endOf("week"),
  ]);



  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data: OverviewResponse = await getOverview({
        dateRange: dateRange
          .map((date: any) => date?.format("YYYY-MM-DD HH:mm:ss"))
          ?.join(","),
      });
      setLoading(false);
      setStats({
        queryCount: data.queryCount,
        mutationCount: data.mutationCount,
        subscribeCount: data.subscribeCount,
        dataSourceCount: data.dataSourceCount,
      });
      if (data.apiStat) setApiStat(data.apiStat);
      if (data.apiRankingList) setRankingData(data.apiRankingList);
    };
    loadData();
  }, [dateRange]);

  const handleDateRangeChange = (newDateRange: [Dayjs, Dayjs]) => {
    setDateRange(newDateRange);
  };


  return (
    <div
      style={{ flex: 1, width: "100%", display: "flex" }}
      className={styles.root}
    >
      <Spin spinning={loading}>
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

        {/* 系统监控组件 */}
        <UnifiedMonitoring />

        {/* 趋势分析组件 */}
        <TrendAnalysis
          apiStat={apiStat}
          rankingData={rankingData}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

      </Spin>
    </div>
  );
};

export default StatisticsPage;

