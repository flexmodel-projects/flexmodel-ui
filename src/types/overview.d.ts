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
  apiStat?: ApiStat;
  apiRankingList?: RankingData[];
} 