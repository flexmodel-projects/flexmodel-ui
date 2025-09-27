import React, {useState} from "react";
import {Badge, Button, Card, Col, DatePicker, List, Row, Space, theme} from "antd";
import ReactECharts from "echarts-for-react";
import dayjs, {Dayjs} from "dayjs";
import {useTranslation} from "react-i18next";
import type {ApiStat, RankingData} from '@/types/overview.d.ts';

const { RangePicker } = DatePicker;

interface TrendAnalysisProps {
  apiStat: ApiStat;
  rankingData: RankingData[];
  dateRange: [Dayjs, Dayjs];
  onDateRangeChange: (dateRange: [Dayjs, Dayjs]) => void;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  apiStat,
  rankingData,
  dateRange,
  onDateRangeChange
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  // 添加选中状态管理
  const [selectedQuickSelect, setSelectedQuickSelect] = useState<"today" | "week" | "month" | "year" | "custom">("week");

  const handleDateChange = (dates: [any, any] | null) => {
    if (dates) {
      onDateRangeChange(dates);
      setSelectedQuickSelect("custom"); // 当用户手动选择日期时，设置为自定义状态
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
    onDateRangeChange([start, end]);
    setSelectedQuickSelect(type); // 设置选中状态
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
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
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
        type: 'line',
        data: apiStat.successData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: token.colorPrimary,
        },
        itemStyle: {
          color: token.colorPrimary,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: token.colorPrimary + '4D'
              },
              {
                offset: 1,
                color: token.colorPrimary + '0D'
              }
            ]
          }
        },
      },
      {
        name: t("fail"),
        type: 'line',
        data: apiStat.failData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: token.colorError,
        },
        itemStyle: {
          color: token.colorError,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: token.colorError + '4D'
              },
              {
                offset: 1,
                color: token.colorError + '0D'
              }
            ]
          }
        },
      },
    ],
  };

  return (
    <Row style={{ marginTop: 6, flex: 1 }} gutter={16}>
      <Col span={24}>
        <Card
          className="flex flex-1 flex-col overflow-hidden"
          style={{
            height: "450px",
            marginBottom: 10,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          title={t("trend_analysis")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.08)';
          }}
          extra={
            <Space>
              <Button
                onClick={() => handleQuickSelect("today")}
                type={selectedQuickSelect === "today" ? "primary" : "text"}
                size="small"
              >
                {t("today")}
              </Button>
              <Button
                onClick={() => handleQuickSelect("week")}
                type={selectedQuickSelect === "week" ? "primary" : "text"}
                size="small"
              >
                {t("week")}
              </Button>
              <Button
                onClick={() => handleQuickSelect("month")}
                type={selectedQuickSelect === "month" ? "primary" : "text"}
                size="small"
              >
                {t("month")}
              </Button>
              <Button
                onClick={() => handleQuickSelect("year")}
                type={selectedQuickSelect === "year" ? "primary" : "text"}
                size="small"
              >
                {t("year")}
              </Button>
              <RangePicker
                value={dateRange}
                onChange={handleDateChange}
                style={selectedQuickSelect === "custom" ? { borderColor: token.colorPrimary } : {}}
                size="small"
              />
            </Space>
          }
        >
          <Row gutter={16} className="h-full">
            <Col span={18}>
              <ReactECharts option={chartConfig} style={{ height: "420px" }} />
            </Col>
            <Col span={6} className="flex flex-col">
              <div>
                <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "16px", color: token.colorText }}>
                  {t("api_ranking")}
                </div>
                <List
                  style={{
                    height: "300px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                  className="flex flex-1 relative"
                  dataSource={rankingData}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: "10px 10px" }}>
                      <div className="flex w-full justify-between">
                        <Space className="overflow-hidden w-60">
                          <Badge count={index + 1} showZero color={index < 3 ? token.colorError : token.colorPrimary} />{" "}
                          <span style={{ color: token.colorText }}>{item.name}</span>
                        </Space>
                        <span style={{ color: token.colorText }}>{item.total}</span>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default TrendAnalysis;
