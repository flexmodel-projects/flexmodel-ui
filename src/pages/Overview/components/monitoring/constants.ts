// 监控组件常量配置

// 定义固定的颜色常量，避免因token变化导致重新计算
export const TAB_COLORS = {
  primary: '#1890ff',
  error: '#ff4d4f', 
  success: '#52c41a',
  info: '#13c2c2',
  warning: '#faad14'
};

// 定义固定的图例配置，避免因数据更新而重新计算
export const CHART_LEGENDS = {
  system: ['CPU使用率 (%)', '内存使用率 (%)', '线程数', '磁盘使用率 (%)'],
  memory: ['内存使用 (GB)', 'Swap使用 (GB)', '缓存 (GB)', '缓冲区 (GB)'],
  thread: ['总线程数', '活跃线程数', '阻塞线程数', '等待线程数'],
  disk: ['读取速度 (MB/s)', '写入速度 (MB/s)', '读取IOPS', '写入IOPS'],
  network: ['入站流量 (MB/s)', '出站流量 (MB/s)', '入站数据包 (个/s)', '出站数据包 (个/s)'],
  jvm: ['堆内存使用 (MB)', '非堆内存使用 (MB)', 'GC时间 (ms)', 'GC次数 (次)']
};

// 定义固定的标题配置
export const CHART_TITLES = {
  system: '系统监控趋势',
  memory: '内存监控趋势',
  thread: '线程监控趋势',
  disk: '磁盘I/O监控趋势',
  network: '网络监控趋势',
  jvm: 'JVM监控趋势'
};

// 监控Tab接口
export interface MonitoringTab {
  key: string;
  title: string;
  value: number;
  color: string;
  unit?: string;
}
