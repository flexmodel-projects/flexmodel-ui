import {getChartLegends, getChartTitles} from './constants';

// 获取图表配置
export const getChartConfig = (activeTab: string, t: (key: string) => string) => {
  const legends = getChartLegends(t);
  const titles = getChartTitles(t);
  const legend = legends[activeTab as keyof typeof legends] || legends.system;
  const title = titles[activeTab as keyof typeof titles] || titles.system;

  return {
    title,
    legend,
    yAxisName: t('metrics.monitoring_trend'),
    tooltipFormatter: (params: any) => {
      let result = params[0].name + '<br/>';
      params.forEach((param: any) => {
        const seriesName = param.seriesName;
        const value = param.value;

        // 根据系列名称判断单位
        if (seriesName.includes(t('metrics.thread')) || seriesName.includes(t('metrics.collection_count')) || seriesName.includes('IOPS') || seriesName.includes('数据包')) {
          result += seriesName + ': ' + value + ' ' + t('metrics.count') + '<br/>';
        } else if (seriesName.includes(t('metrics.gb'))) {
          result += seriesName + ': ' + value + ' ' + t('metrics.gb') + '<br/>';
        } else if (seriesName.includes(t('metrics.mb'))) {
          result += seriesName + ': ' + value + ' ' + t('metrics.mb') + '<br/>';
        } else if (seriesName.includes(t('metrics.ms')) || seriesName.includes(t('metrics.collection_time'))) {
          result += seriesName + ': ' + value + ' ' + t('metrics.ms') + '<br/>';
        } else if (seriesName.includes('MB/s') || seriesName.includes('速度') || seriesName.includes('流量')) {
          result += seriesName + ': ' + value + ' MB/s<br/>';
        } else if (seriesName.includes('%') || seriesName.includes(t('metrics.usage_percentage'))) {
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
    case 'thread':
      return {
        time: history.time,
        series1: history.threads,
        series2: history.threads.map(() => Math.round(metricsData.threads.threadCount - metricsData.threads.daemonThreadCount)),
        series3: history.threads.map(() => Math.round(Object.values(metricsData.threads.threadStates).reduce((a: number, b: unknown) => a + (typeof b === 'number' ? b : 0), 0) * 0.1)),
        series4: history.threads.map(() => Math.round(metricsData.threads.peakThreadCount)),
      };
    case 'disk':
      return {
        time: history.time,
        series1: history.disk,
        series2: history.disk.map(() => Math.round(metricsData.disk.totalUsableSpace / (1024 * 1024 * 1024))),
        series3: history.disk.map(() => Math.round(metricsData.disk.totalSpace / (1024 * 1024 * 1024))),
        series4: history.disk.map(() => Math.round(metricsData.disk.totalFreeSpace / (1024 * 1024 * 1024))),
      };
    case 'network':
      return {
        time: history.time,
        series1: history.network,
        series2: history.network.map(() => Math.round(metricsData.network.totalInterfaces)),
        series3: history.network.map(() => Math.round(metricsData.network.stats.activeInterfaces)),
        series4: history.network.map(() => Math.round(Object.keys(metricsData.network.interfaces).length)),
      };
    case 'jvm':
      return {
        time: history.time,
        series1: history.jvm,
        series2: history.jvm.map(() => Math.round(metricsData.memory.heap.used / (1024 * 1024))),
        series3: history.jvm.map(() => Math.round(Object.values(metricsData.jvm.garbageCollectors).reduce((sum: number, gc: any) => sum + gc.collectionTime, 0))),
        series4: history.jvm.map(() => Math.round(Object.values(metricsData.jvm.garbageCollectors).reduce((sum: number, gc: any) => sum + gc.collectionCount, 0) * 0.1)),
      };
    default:
      return { time: [], series1: [], series2: [], series3: [], series4: [] };
  }
};
