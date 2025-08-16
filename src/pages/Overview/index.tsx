import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Col, DatePicker, List, Row, Space, Spin, theme} from "antd";
import ReactECharts from "echarts-for-react";
import dayjs, {Dayjs} from "dayjs";
import {DatabaseOutlined, FlagOutlined, HourglassOutlined, RocketOutlined} from "@ant-design/icons";
import {getOverview} from "@/services/overview.ts";
import {useTranslation} from "react-i18next";
import styles from "@/pages/Overview/index.module.scss";
import type {ApiStat, OverviewResponse, RankingData, Statistics} from '@/types/overview.d.ts';

const { RangePicker } = DatePicker;

// 自定义统计卡片组件
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <div className={styles.statTitle}>{title}</div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </div>
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

  const handleDateChange = (dates: [any, any] | null) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const handleQuickSelect = (type: "today" | "week" | "month" | "year") => {
    let start: Dayjs, end: Dayjs;
    const now = dayjs();
    switch (type) {
      case "today":
        start = now.startOf("day");
        end = now.endOf("day");
        break;
      case "week":
        start = now.startOf("week");
        end = now.endOf("week");
        break;
      case "month":
        start = now.startOf("month");
        end = now.endOf("month");
        break;
      case "year":
        start = now.startOf("year");
        end = now.endOf("year");
        break;
      default:
        start = now.startOf("day");
        end = now.endOf("day");
    }
    setDateRange([start, end]);
  };

  // ECharts 配置 - 使用 Ant Design token
  const chartConfig = {
    backgroundColor: 'transparent',
    textStyle: {
      color: token.colorText,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: token.colorBgElevated,
      borderColor: token.colorBorder,
      textStyle: {
        color: token.colorText,
      },
    },
    legend: {
      data: [t("success"), t("fail")],
      textStyle: {
        color: token.colorText,
      },
    },
    grid: {
      top: "3%",
      left: "3%",
      right: "3%",
      containLabel: true,
      borderColor: token.colorBorder,
    },
    xAxis: {
      type: "category",
      data: apiStat.dateList,
      axisLine: {
        lineStyle: {
          color: token.colorBorder,
        },
      },
      axisLabel: {
        color: token.colorText,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: token.colorBorder,
        },
      },
      axisLabel: {
        color: token.colorText,
      },
      splitLine: {
        lineStyle: {
          color: token.colorBorderSecondary,
        },
      },
    },
    series: [
      {
        name: t("success"),
        type: "line",
        data: apiStat.successData,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorSuccess
        },
        itemStyle: { 
          color: token.colorSuccess
        },
        areaStyle: {
          color: token.colorSuccess + '20'
        }
      },
      {
        name: t("fail"),
        type: "line",
        data: apiStat.failData,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorError
        },
        itemStyle: { 
          color: token.colorError
        },
        areaStyle: {
          color: token.colorError + '20'
        }
      },
    ],
  };

  return (
    <div
      style={{ flex: 1, width: "100%", display: "flex" }}
      className={styles.root}
    >
      <Spin spinning={loading}>
        <Row gutter={12}>
          <Col span={6}>
            <Card className={styles.statCardWrapper}>
              <StatCard
                title={t("query")}
                value={stats.queryCount}
                icon={<HourglassOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />}
                color={token.colorPrimaryBg}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={styles.statCardWrapper}>
              <StatCard
                title={t("mutation")}
                value={stats.mutationCount}
                icon={<FlagOutlined style={{ fontSize: '24px', color: token.colorSuccess }} />}
                color={token.colorSuccessBg}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={styles.statCardWrapper}>
              <StatCard
                title={t("subscription")}
                value={stats.subscribeCount}
                icon={<RocketOutlined style={{ fontSize: '24px', color: token.colorError }} />}
                color={token.colorErrorBg}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={styles.statCardWrapper}>
              <StatCard
                title={t("datasource")}
                value={stats.dataSourceCount}
                icon={<DatabaseOutlined style={{ fontSize: '24px', color: token.colorInfo }} />}
                color={token.colorInfoBg}
              />
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 10, flex: 1 }} gutter={16}>
          <Col span={24}>
            <Card
              className="flex flex-1 h-full flex-col overflow-hidden"
              title={t("trend_analysis")}
              extra={
                <Space>
                  <Button onClick={() => handleQuickSelect("today")} type="text">
                    {t("today")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("week")} type="text">
                    {t("week")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("month")} type="text">
                    {t("month")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("year")} type="text">
                    {t("year")}
                  </Button>
                  <RangePicker value={dateRange} onChange={handleDateChange} />
                </Space>
              }
            >
              <Row gutter={16} className="h-full">
                <Col span={18}>
                  <ReactECharts option={chartConfig} style={{ height: "100%", minHeight: "400px" }} />
                </Col>
                <Col span={6} className="flex flex-col">
                  <Card title={t("api_ranking")} variant="borderless">
                    <List
                      style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "55vh" }}
                      className="flex flex-1 relative"
                      dataSource={rankingData}
                      renderItem={(item, index) => (
                        <List.Item style={{ padding: "10px 16px" }}>
                          <div className="flex w-full justify-between">
                            <Space className="overflow-hidden w-60">
                              <Badge count={index + 1} showZero color={index < 3 ? "red" : "green"} />{" "}
                              <span style={{ color: token.colorText }}>{item.name}</span>
                            </Space>
                            <span style={{ color: token.colorText }}>{item.total}</span>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default StatisticsPage;

