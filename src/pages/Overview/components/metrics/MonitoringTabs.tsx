import React, {useMemo} from 'react';
import {Progress, Tabs, Tag, theme} from 'antd';
import {useTranslation} from 'react-i18next';
import {MonitoringTab, TAB_COLORS} from './constants';

const { useToken } = theme;

interface MonitoringTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  metricsData: any;
}

const MonitoringTabs: React.FC<MonitoringTabsProps> = ({ activeTab, onTabChange, metricsData }) => {
  const { token } = useToken();
  const { t } = useTranslation();

  const monitoringTabs: MonitoringTab[] = useMemo(() => {
    if (!metricsData) {
      return [
        { key: 'system', title: t('metrics.system_summary'), value: 0, color: TAB_COLORS.primary, unit: '%' },
        { key: 'thread', title: t('metrics.thread'), value: 0, color: TAB_COLORS.success, unit: t('metrics.count') },
        { key: 'network', title: t('metrics.network'), value: 0, color: TAB_COLORS.info, unit: t('metrics.count') },
        { key: 'disk', title: t('metrics.disk'), value: 0, color: TAB_COLORS.warning, unit: '%' },
        { key: 'jvm', title: t('metrics.jvm'), value: 0, color: TAB_COLORS.primary, unit: '%' },
      ];
    }

    return [
      {
        key: 'system',
        title: t('metrics.system_summary'),
        value: Math.round(metricsData.cpu.processCpuLoad),
        color: TAB_COLORS.primary,
        unit: '%',
      },
      {
        key: 'jvm',
        title: t('metrics.jvm'),
        value: Math.round(metricsData.memory.heap.usagePercentage),
        color: TAB_COLORS.primary,
        unit: '%',
      },
      {
        key: 'thread',
        title: t('metrics.thread'),
        value: Math.round(metricsData.threads.threadCount),
        color: TAB_COLORS.success,
        unit: t('metrics.count'),
        showAsProgress: false,
      },
      {
        key: 'network',
        title: t('metrics.network'),
        value: Math.round(metricsData.network.totalInterfaces),
        color: TAB_COLORS.info,
        unit: t('metrics.count'),
        showAsProgress: false,
      },
      {
        key: 'disk',
        title: t('metrics.disk'),
        value: Math.round(metricsData.disk.diskIo.fileSystemStats.spaceUtilization),
        color: TAB_COLORS.warning,
        unit: '%',
      },
    ];
  }, [metricsData, t]);

  return (
    <Tabs
      activeKey={activeTab}
      onChange={onTabChange}
      destroyOnHidden={false}
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
            {tab.showAsProgress === false ? (
              // 对于线程和网络，使用简洁的数字标签形式
              <Tag color={tab.color}>
                {tab.value}{tab.unit || ''}
              </Tag>
            ) : (
              // 对于其他Tab，使用进度条形式
              <Progress
                type="circle"
                percent={tab.value}
                size={32}
                strokeColor={tab.color}
                format={() => `${tab.value}${tab.unit || ''}`}
              />
            )}
          </div>
        ),
      }))}
      tabBarStyle={{
        marginBottom: '16px',
        backgroundColor: token.colorBgContainer,
        borderRadius: '8px',
      }}
      tabBarGutter={8}
      centered={false}
      size="middle"
    />
  );
};

export default MonitoringTabs;
