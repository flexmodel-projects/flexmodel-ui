import React, {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {getOverview} from "@/services/overview.ts";
import type {ApiStat, OverviewResponse, RankingData, Statistics} from '@/types/overview.d.ts';
import TrendAnalysis from '@/components/common/TrendAnalysis';
import StatisticsCards from '@/pages/Overview/components/StatisticsCards';
import UnifiedMonitoring from "@/pages/Overview/components/metrics/UnifiedMonitoring.tsx";


const StatisticsPage: React.FC = () => {
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
      const data: OverviewResponse = await getOverview({
        dateRange: dateRange
          .map((date: any) => date?.format("YYYY-MM-DD HH:mm:ss"))
          ?.join(","),
      });
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
      style={{
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* 统计卡片组件 */}
      <StatisticsCards stats={stats} />

      {/* 系统监控组件 */}
      <UnifiedMonitoring />

      {/* 趋势分析组件 */}
      <TrendAnalysis
        apiStat={apiStat}
        rankingData={rankingData}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
};

export default StatisticsPage;

