import {CHART_LEGENDS, CHART_TITLES} from './constants';

// 获取图表配置
export const getChartConfig = (activeTab: string) => {
  const legend = CHART_LEGENDS[activeTab as keyof typeof CHART_LEGENDS] || CHART_LEGENDS.system;
  const title = CHART_TITLES[activeTab as keyof typeof CHART_TITLES] || CHART_TITLES.system;

  return {
    title,
    legend,
    yAxisName: '数值',
    tooltipFormatter: (params: any) => {
      let result = params[0].name + '<br/>';
      params.forEach((param: any) => {
        const seriesName = param.seriesName;
        const value = param.value;

        // 根据系列名称判断单位
        if (seriesName.includes('线程') || seriesName.includes('次数') || seriesName.includes('IOPS') || seriesName.includes('数据包')) {
          result += seriesName + ': ' + value + ' 个<br/>';
        } else if (seriesName.includes('GB') || seriesName.includes('内存')) {
          result += seriesName + ': ' + value + ' GB<br/>';
        } else if (seriesName.includes('MB')) {
          result += seriesName + ': ' + value + ' MB<br/>';
        } else if (seriesName.includes('ms') || seriesName.includes('时间')) {
          result += seriesName + ': ' + value + ' ms<br/>';
        } else if (seriesName.includes('MB/s') || seriesName.includes('速度') || seriesName.includes('流量')) {
          result += seriesName + ': ' + value + ' MB/s<br/>';
        } else if (seriesName.includes('%') || seriesName.includes('使用率')) {
          result += seriesName + ': ' + value + '%<br/>';
        } else {
          result += seriesName + ': ' + value + '<br/>';
        }
      });
      return result;
    }
  };
};

// 获取当前选中tab的数据
export const getCurrentTabData = (metricsData: any, activeTab: string) => {
  if (!metricsData) {
    return { time: [], series1: [], series2: [], series3: [], series4: [] };
  }

  const history = metricsData.history;

  switch (activeTab) {
    case 'system':
      return {
        time: history.time,
        series1: history.cpu,
        series2: history.memory,
        series3: history.threads,
        series4: history.disk,
      };
    case 'memory':
      return {
        time: history.time,
        series1: history.memory,
        series2: history.memory.map(() => metricsData.memory.nonHeap.usagePercentage),
        series3: history.memory.map(() => metricsData.cpu.totalPhysicalMemorySize / (1024 * 1024 * 1024) * 0.1),
        series4: history.memory.map(() => metricsData.cpu.freePhysicalMemorySize / (1024 * 1024 * 1024) * 0.1),
      };
    case 'thread':
      return {
        time: history.time,
        series1: history.threads,
        series2: history.threads.map(() => metricsData.threads.threadCount - metricsData.threads.daemonThreadCount),
        series3: history.threads.map(() => Object.values(metricsData.threads.threadStates).reduce((a: number, b: unknown) => a + (typeof b === 'number' ? b : 0), 0) * 0.1),
        series4: history.threads.map(() => metricsData.threads.peakThreadCount),
      };
    case 'disk':
      return {
        time: history.time,
        series1: history.disk,
        series2: history.disk.map(() => metricsData.disk.totalUsableSpace / (1024 * 1024 * 1024)),
        series3: history.disk.map(() => metricsData.disk.totalSpace / (1024 * 1024 * 1024)),
        series4: history.disk.map(() => metricsData.disk.totalFreeSpace / (1024 * 1024 * 1024)),
      };
    case 'network':
      return {
        time: history.time,
        series1: history.network,
        series2: history.network.map(() => metricsData.network.totalInterfaces),
        series3: history.network.map(() => metricsData.network.stats.activeInterfaces),
        series4: history.network.map(() => Object.keys(metricsData.network.interfaces).length),
      };
    case 'jvm':
      return {
        time: history.time,
        series1: history.jvm,
        series2: history.jvm.map(() => metricsData.memory.heap.used / (1024 * 1024)),
        series3: history.jvm.map(() => Object.values(metricsData.jvm.garbageCollectors).reduce((sum: number, gc: any) => sum + gc.collectionTime, 0)),
        series4: history.jvm.map(() => Object.values(metricsData.jvm.garbageCollectors).reduce((sum: number, gc: any) => sum + gc.collectionCount, 0) * 0.1),
      };
    default:
      return { time: [], series1: [], series2: [], series3: [], series4: [] };
  }
};
