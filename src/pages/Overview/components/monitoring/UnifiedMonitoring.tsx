import React, {useCallback, useState} from 'react';
import {Alert, Card, Spin} from 'antd';
import {useMetricsData} from './useMetricsData';
import MonitoringTabs from './MonitoringTabs';
import DetailedInfo from './DetailedInfo';
import MonitoringChart from './MonitoringChart';

const UnifiedMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [dataZoomRange, setDataZoomRange] = useState<{ start: number; end: number }>({ start: 0, end: 100 });
  const { data: metricsData, loading, error } = useMetricsData();

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  const handleDataZoomChange = useCallback((range: { start: number; end: number }) => {
    setDataZoomRange(range);
  }, []);

  if (loading && !metricsData) {
    return (
      <Card
        title="系统监控"
        style={{ height: '480px' }}
        bodyStyle={{ height: '430px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Spin size="large" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title="系统监控"
        style={{ height: '480px' }}
        bodyStyle={{ height: '430px', padding: '16px' }}
      >
        <Alert
          message="监控数据加载失败"
          description={error}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card
      title="系统监控详情"
      style={{ minHeight: '400px' }}
      bodyStyle={{ padding: '16px' }}
    >
      {/* 监控Tab切换 */}
      <MonitoringTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        metricsData={metricsData}
      />

      {/* 详细监控信息 */}
      <DetailedInfo
        activeTab={activeTab}
        metricsData={metricsData}
      />

      {/* 监控趋势图 */}
      <MonitoringChart
        activeTab={activeTab}
        metricsData={metricsData}
        dataZoomRange={dataZoomRange}
        onDataZoomChange={handleDataZoomChange}
      />
    </Card>
  );
};

export default React.memo(UnifiedMonitoring);
