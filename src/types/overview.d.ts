export interface Statistics {
  queryCount: number;
  mutationCount: number;
  subscribeCount: number;
  dataSourceCount: number;
}

export interface RankingData {
  name: string;
  total: number;
}

export interface ApiStat {
  dateList: string[];
  successData: number[];
  failData: number[];
}

export interface OverviewResponse {
  queryCount: number;
  mutationCount: number;
  subscribeCount: number;
  dataSourceCount: number;
  // 根据需要添加apiRankingList和apiStat，如果openapi中指定
} 