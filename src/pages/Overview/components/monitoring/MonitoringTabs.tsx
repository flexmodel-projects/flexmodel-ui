import React, {useMemo} from 'react';
import {Progress, Tabs, theme} from 'antd';
import {MonitoringTab, TAB_COLORS} from './constants';

const { useToken } = theme;

interface MonitoringTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  metricsData: any;
}

const MonitoringTabs: React.FC<MonitoringTabsProps> = ({ activeTab, onTabChange, metricsData }) => {
  const { token } = useToken();

  const monitoringTabs: MonitoringTab[] = useMemo(() => {
    if (!metricsData) {
      return [
        { key: 'system', title: '系统概览', value: 0, color: TAB_COLORS.primary, unit: '%' },
        { key: 'memory', title: '内存', value: 0, color: TAB_COLORS.error, unit: '%' },
        { key: 'thread', title: '线程', value: 0, color: TAB_COLORS.success, unit: '个' },
        { key: 'network', title: '网络', value: 0, color: TAB_COLORS.info, unit: '个' },
        { key: 'disk', title: '磁盘', value: 0, color: TAB_COLORS.warning, unit: '%' },
        { key: 'jvm', title: 'JVM', value: 0, color: TAB_COLORS.primary, unit: '%' },
      ];
    }

    return [
      {
        key: 'system',
        title: '系统概览',
        value: Math.round(metricsData.cpu.processCpuLoad * 100),
        color: TAB_COLORS.primary,
        unit: '%',
      },
      {
        key: 'jvm',
        title: 'JVM',
        value: Math.round(metricsData.memory.heap.usagePercentage),
        color: TAB_COLORS.primary,
        unit: '%',
      },
      {
        key: 'memory',
        title: '内存',
        value: Math.round(metricsData.memory.heap.usagePercentage),
        color: TAB_COLORS.error,
        unit: '%',
      },
      {
        key: 'thread',
        title: '线程',
        value: metricsData.threads.threadCount,
        color: TAB_COLORS.success,
        unit: '个',
      },
      {
        key: 'network',
        title: '网络',
        value: metricsData.network.totalInterfaces,
        color: TAB_COLORS.info,
        unit: '个',
      },
      {
        key: 'disk',
        title: '磁盘',
        value: Math.round(metricsData.disk.diskIo.fileSystemStats.spaceUtilization),
        color: TAB_COLORS.warning,
        unit: '%',
      },
    ];
  }, [metricsData]);

  return (
    <Tabs
      activeKey={activeTab}
      onChange={onTabChange}
      destroyInactiveTabPane={false}
      items={monitoringTabs.map((tab) => ({
        key: tab.key,
        label: (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            justifyContent: 'center',
            minWidth: '120px'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{tab.title}</span>
            <Progress
              type="circle"
              percent={activeTab === 'thread' ? Math.min((tab.value / 200) * 100, 100) : tab.value}
              size={32}
              strokeColor={tab.color}
              format={() => `${tab.value}${tab.unit || ''}`}
            />
          </div>
        ),
      }))}
      tabBarStyle={{
        marginBottom: '16px',
        backgroundColor: token.colorBgContainer,
        borderRadius: '8px',
        padding: '8px',
      }}
      tabBarGutter={8}
      centered={false}
      size="middle"
    />
  );
};

export default MonitoringTabs;
