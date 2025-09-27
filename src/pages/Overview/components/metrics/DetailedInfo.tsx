import React from 'react';
import {Badge, Descriptions, Table, Tag, theme} from 'antd';
import {useTranslation} from 'react-i18next';

interface DetailedInfoProps {
  metricsData: any;
  cardKey?: string; // 新增cardKey参数，用于指定显示特定的Card
}

const {useToken} = theme;

const DetailedInfo: React.FC<DetailedInfoProps> = ({metricsData, cardKey}) => {
  const {token} = useToken();
  const {t} = useTranslation();
  if (!metricsData) return null;

  const renderSingleCard = (cardKey: string) => {
    switch (cardKey) {
      // 系统概览Tab的Card
      case 'cpu':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={t('metrics.system_load_average')}>{Math.round(metricsData.cpu.systemLoadAverage)}%</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.process_cpu_usage')}>{Math.round(metricsData.cpu.processCpuLoad)}%</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.system_cpu_usage')}>{Math.round(metricsData.cpu.systemCpuLoad)}%</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.available_processors')}>{Math.round(metricsData.cpu.availableProcessors)}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.system_architecture')}>{metricsData.cpu.architecture}</Descriptions.Item>
          </Descriptions>
        );
      case 'physical_memory':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={t('metrics.total_physical_memory')}>{Math.round(metricsData.cpu.totalPhysicalMemorySize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.free_physical_memory')}>{Math.round(metricsData.cpu.freePhysicalMemorySize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.total_swap_space')}>{Math.round(metricsData.cpu.totalSwapSpaceSize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.free_swap_space')}>{Math.round(metricsData.cpu.freeSwapSpaceSize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
          </Descriptions>
        );
      case 'system':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.operating_system')}>{metricsData.cpu.name}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.system_version')}>{metricsData.cpu.version}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.system_load')}>{metricsData.cpu.systemLoadAverage > 0 ? metricsData.cpu.systemLoadAverage.toFixed(2) : 'N/A'}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.uptime')}>{Math.round(metricsData.jvm.uptime / 1000 / 60)}{t('metrics.minutes')}</Descriptions.Item>
          </Descriptions>
        );
      case 'jvm':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.jvm_name')}>{metricsData.jvm.name}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.jvm_version')}>{metricsData.jvm.version}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.jvm_vendor')}>{metricsData.jvm.vendor}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.loaded_classes')}>{Math.round(metricsData.jvm.loadedClassCount)}{t('metrics.count')}</Descriptions.Item>
          </Descriptions>
        );

      // 内存Tab的Card
      case 'heap': {
        const heap = metricsData?.memory?.heap || {};
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={t('metrics.initial_size')}>{heap.init ? Math.round(heap.init / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.used')}>{heap.used ? Math.round(heap.used / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.committed')}>{heap.committed ? Math.round(heap.committed / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.max_size')}>{heap.max ? Math.round(heap.max / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.usage_percentage')}>{Math.round(heap.usagePercentage || 0)}%</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'nonheap': {
        const nonHeap = metricsData?.memory?.nonHeap || {};
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={t('metrics.initial_size')}>{nonHeap.init ? Math.round(nonHeap.init / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.used')}>{nonHeap.used ? Math.round(nonHeap.used / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.committed')}>{nonHeap.committed ? Math.round(nonHeap.committed / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.max_size')}>{nonHeap.max === -1 ? t('metrics.unlimited') : nonHeap.max ? Math.round(nonHeap.max / (1024 * 1024)) + t('metrics.mb') : '0' + t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.usage_percentage')}>{Math.round(nonHeap.usagePercentage || 0)}%</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'memory_pools': {
        const memoryPools = metricsData?.memory?.memoryPools || {};
        return (
          <div>
            <Table
              size="small"
              dataSource={Object.entries(memoryPools).map(([name, pool]: [string, any]) => ({
                key: name,
                name,
                type: pool.type || '未知',
                init: pool.init ? Math.round(pool.init / (1024 * 1024)) : 0,
                used: pool.used ? Math.round(pool.used / (1024 * 1024)) : 0,
                committed: pool.committed ? Math.round(pool.committed / (1024 * 1024)) : 0,
                max: pool.max === -1 ? '无限制' : pool.max ? Math.round(pool.max / (1024 * 1024)) : 0,
                usagePercentage: Math.round(pool.usagePercentage || 0),
                memoryManagerNames: pool.memoryManagerNames || [],
              }))}
              columns={[
                {title: t('name'), dataIndex: 'name', key: 'name'},
                {title: t('metrics.type'), dataIndex: 'type', key: 'type'},
                {title: t('metrics.initial_size') + '(' + t('metrics.mb') + ')', dataIndex: 'init', key: 'init'},
                {title: t('metrics.used') + '(' + t('metrics.mb') + ')', dataIndex: 'used', key: 'used'},
                {title: t('metrics.committed') + '(' + t('metrics.mb') + ')', dataIndex: 'committed', key: 'committed'},
                {title: t('metrics.max_size') + '(' + t('metrics.mb') + ')', dataIndex: 'max', key: 'max'},
                {
                  title: t('metrics.usage_percentage'),
                  dataIndex: 'usagePercentage',
                  key: 'usagePercentage',
                  render: (percentage: number) => (
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{
                        width: '60px',
                        height: '8px',
                        backgroundColor: token.colorFillSecondary,
                        borderRadius: '4px'
                      }}>
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: percentage > 80 ? token.colorError : percentage > 60 ? token.colorWarning : token.colorSuccess,
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span>{percentage}%</span>
                    </div>
                  )
                },
                {
                  title: t('metrics.memory_manager'),
                  dataIndex: 'memoryManagerNames',
                  key: 'memoryManagerNames',
                  render: (names: any) => Array.isArray(names) ? names.join(', ') : (names || t('metrics.unknown'))
                },
              ]}
              pagination={false}
              scroll={{y: 300}}
            />
          </div>
        );
      }

      // JVM Tab的Card
      case 'basic': {
        const jvm = metricsData?.jvm || {};
        return (
          <Descriptions column={2} size="small">
            <Descriptions.Item label={t('metrics.jvm_name')}>{jvm.name || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.jvm_version')}>{jvm.version || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.jvm_vendor')}>{jvm.vendor || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.uptime')}>{jvm.uptime ? Math.round(jvm.uptime / 1000 / 60) : 0} {t('metrics.minutes')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.start_time')}>{jvm.startTime ? new Date(jvm.startTime).toLocaleString() : t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.loaded_classes')}>{jvm.loadedClassCount || 0}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.total_loaded_classes')}>{jvm.totalLoadedClassCount || 0}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.unloaded_classes')}>{jvm.unloadedClassCount || 0}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'gc': {
        const garbageCollectors = metricsData?.jvm?.garbageCollectors || {};
        return (
          <Table
            size="small"
            dataSource={Object.entries(garbageCollectors).map(([name, gc]: [string, any]) => ({
              key: name,
              name,
              collectionCount: gc.collectionCount || 0,
              collectionTime: gc.collectionTime || 0,
            }))}
            columns={[
              {title: t('metrics.collector_name'), dataIndex: 'name', key: 'name'},
              {title: t('metrics.collection_count'), dataIndex: 'collectionCount', key: 'collectionCount'},
              {
                title: t('metrics.collection_time') + '(' + t('metrics.ms') + ')',
                dataIndex: 'collectionTime',
                key: 'collectionTime'
              },
            ]}
            pagination={false}
            scroll={{y: 200}}
          />
        );
      }

      // 线程Tab的Card
      case 'thread_stats': {
        const threads = metricsData?.threads || {};
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={t('metrics.current_threads')}>{threads.threadCount || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.peak_threads')}>{threads.peakThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.daemon_threads')}>{threads.daemonThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.started_threads')}>{threads.totalStartedThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'thread_states': {
        const threadStates = metricsData?.threads?.threadStates || {};
        return (
          <div>
            {Object.entries(threadStates).map(([state, count]: [string, any]) => (
              <div key={state} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <Tag
                  color={state === 'RUNNABLE' ? 'green' : state === 'WAITING' ? 'orange' : state === 'BLOCKED' ? 'red' : 'default'}>
                  {state}
                </Tag>
                <span>{count} {t('metrics.count')}</span>
              </div>
            ))}
          </div>
        );
      }
      case 'thread_details': {
        const threadDetails = metricsData?.threads?.threads || metricsData?.threads?.threadDetails || {};
        return (
          <Table
            size="small"
            dataSource={Object.entries(threadDetails).map(([id, thread]: [string, any]) => ({
              key: id,
              id: thread.threadId || id,
              name: thread.threadName || thread.name || '未知',
              state: thread.threadState || thread.state || 'UNKNOWN',
              blockedCount: thread.blockedCount || 0,
              waitedCount: thread.waitedCount || 0,
              cpuTime: thread.cpuTime || 0,
              userTime: thread.userTime || 0,
            }))}
            columns={[
              {title: 'ID', dataIndex: 'id', key: 'id', width: 60},
              {title: t('name'), dataIndex: 'name', key: 'name', ellipsis: true},
              {
                title: t('metrics.status'),
                dataIndex: 'state',
                key: 'state',
                render: (state: string) => (
                  <Tag
                    color={state === 'RUNNABLE' ? 'green' : state === 'WAITING' ? 'orange' : state === 'BLOCKED' ? 'red' : 'default'}>
                    {state}
                  </Tag>
                )
              },
              {title: t('metrics.blocked_count'), dataIndex: 'blockedCount', key: 'blockedCount'},
              {title: t('metrics.waited_count'), dataIndex: 'waitedCount', key: 'waitedCount'},
              {title: t('metrics.cpu_time') + '(' + t('metrics.ms') + ')', dataIndex: 'cpuTime', key: 'cpuTime'},
              {title: t('metrics.user_time') + '(' + t('metrics.ms') + ')', dataIndex: 'userTime', key: 'userTime'},
            ]}
            pagination={false}
            scroll={{y: 200}}
          />
        );
      }

      case 'network_stats': {
        const network = metricsData?.network || {};
        const networkStats = network.stats || {};
        const localhost = network.localhost || {};
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={t('metrics.total_interfaces')}>{network.totalInterfaces || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.active_interfaces')}>{networkStats.activeInterfaces || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.hostname')}>{localhost.hostName || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.host_address')}>{localhost.hostAddress || t('metrics.unknown')}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'network_interfaces': {
        const interfaces = metricsData?.network?.interfaces || {};
        return (
          <Table
            size="small"
            dataSource={Object.entries(interfaces).map(([name, iface]: [string, any]) => ({
              key: name,
              name: iface.name || name,
              displayName: iface.displayName || '未知',
              up: iface.up || false,
              virtual: iface.virtual || false,
              loopback: iface.loopback || false,
              pointToPoint: iface.pointToPoint || false,
              mtu: iface.mtu || 0,
              macAddress: iface.macAddress || '未知',
              addressCount: iface.addresses ? Object.keys(iface.addresses).length : 0,
            }))}
            columns={[
              {title: t('name'), dataIndex: 'name', key: 'name'},
              {title: t('metrics.display_name'), dataIndex: 'displayName', key: 'displayName', ellipsis: true},
              {
                title: t('metrics.status'),
                dataIndex: 'up',
                key: 'up',
                render: (up: boolean) => (
                  <Badge status={up ? 'success' : 'error'} text={up ? t('metrics.online') : t('metrics.offline')}/>
                )
              },
              {
                title: t('metrics.type'),
                key: 'type',
                render: (_, record: any) => (
                  <div>
                    {record.virtual && <Tag>{t('metrics.virtual')}</Tag>}
                    {record.loopback && <Tag>{t('metrics.loopback')}</Tag>}
                    {record.pointToPoint && <Tag>{t('metrics.point_to_point')}</Tag>}
                  </div>
                )
              },
              {title: 'MTU', dataIndex: 'mtu', key: 'mtu'},
              {title: t('metrics.mac_address'), dataIndex: 'macAddress', key: 'macAddress', ellipsis: true},
              {title: t('metrics.address_count'), dataIndex: 'addressCount', key: 'addressCount'},
            ]}
            pagination={false}
            scroll={{y: 300}}
          />
        );
      }

      case 'disk_stats': {
        const disk = metricsData?.disk || {};
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item
              label={t('metrics.file_systems')}>{disk.totalFileSystems || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.total_space')}>{disk.totalSpace ? Math.round(disk.totalSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.available_space')}>{disk.totalUsableSpace ? Math.round(disk.totalUsableSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item
              label={t('metrics.free_space')}>{disk.totalFreeSpace ? Math.round(disk.totalFreeSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'filesystems': {
        const fileSystems = metricsData?.disk?.fileSystems || {};
        return (
          <Table
            size="small"
            dataSource={Object.entries(fileSystems).map(([name, fs]: [string, any]) => ({
              key: name,
              name: name || '未知',
              type: fs.type || '未知',
              totalSpace: fs.totalSpace ? Math.round(fs.totalSpace / (1024 * 1024 * 1024)) : 0,
              usableSpace: fs.usableSpace ? Math.round(fs.usableSpace / (1024 * 1024 * 1024)) : 0,
              freeSpace: fs.freeSpace ? Math.round(fs.freeSpace / (1024 * 1024 * 1024)) : 0,
              usagePercentage: fs.totalSpace && fs.freeSpace ? Math.round((fs.totalSpace - fs.freeSpace) / fs.totalSpace * 100) : 0,
            }))}
            columns={[
              {title: t('name'), dataIndex: 'name', key: 'name'},
              {title: t('metrics.type'), dataIndex: 'type', key: 'type'},
              {
                title: t('metrics.total_space') + '(' + t('metrics.gb') + ')',
                dataIndex: 'totalSpace',
                key: 'totalSpace'
              },
              {
                title: t('metrics.available_space') + '(' + t('metrics.gb') + ')',
                dataIndex: 'usableSpace',
                key: 'usableSpace'
              },
              {
                title: t('metrics.free_space') + '(' + t('metrics.gb') + ')',
                dataIndex: 'freeSpace',
                key: 'freeSpace'
              },
              {
                title: t('metrics.usage_percentage'),
                dataIndex: 'usagePercentage',
                key: 'usagePercentage',
                render: (percentage: number) => (
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{
                      width: '60px',
                      height: '8px',
                      backgroundColor: token.colorFillSecondary,
                      borderRadius: '4px'
                    }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: percentage > 80 ? token.colorError : percentage > 60 ? token.colorWarning : token.colorSuccess,
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <span>{percentage}%</span>
                  </div>
                )
              },
            ]}
            pagination={false}
            scroll={{y: 300}}
          />
        );
      }

      default:
        return null;
    }
  };
  if (cardKey) {
    return renderSingleCard(cardKey);
  }
};

export default DetailedInfo;
