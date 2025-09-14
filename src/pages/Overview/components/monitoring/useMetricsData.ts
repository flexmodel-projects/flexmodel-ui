import {useCallback, useEffect, useState} from 'react'
import {AllMetricsResponse, getAllMetrics} from '@/services/metrics'

interface MetricsData extends AllMetricsResponse {
  history: {
    time: string[]
    cpu: number[]
    memory: number[]
    disk: number[]
    network: number[]
    threads: number[]
    jvm: number[]
  }
}

export const useMetricsData = () => {
  const [data, setData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const metricsData = await getAllMetrics()

      // 更新历史数据
      const now = new Date()
      const timeStr = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })

      setData(prevData => {
        const prevHistory = prevData?.history || {
          time: [],
          cpu: [],
          memory: [],
          disk: [],
          network: [],
          threads: [],
          jvm: [],
        }

        const newHistory = {
          time: [...prevHistory.time.slice(-29), timeStr],
          cpu: [...prevHistory.cpu.slice(-29), metricsData.cpu.processCpuLoad * 100],
          memory: [...prevHistory.memory.slice(-29), metricsData.memory.heap.usagePercentage],
          disk: [...prevHistory.disk.slice(-29), metricsData.disk.diskIo.fileSystemStats.spaceUtilization],
          network: [...prevHistory.network.slice(-29),
            metricsData.network.stats.activeInterfaces > 0 ?
            (metricsData.network.stats.activeInterfaces / metricsData.network.totalInterfaces * 100) : 0
          ],
          threads: [...prevHistory.threads.slice(-29), metricsData.threads.threadCount],
          jvm: [...prevHistory.jvm.slice(-29), metricsData.memory.heap.usagePercentage],
        }

        return {
          ...metricsData,
          history: newHistory,
        }
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取监控数据失败'
      setError(errorMessage)
      console.error('Failed to fetch metrics:', err)

      // 如果是网络错误或认证错误，提供更详细的错误信息
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setError('认证失败，请检查登录状态')
        } else if (err.message.includes('Network Error') || err.message.includes('fetch')) {
          setError('网络连接失败，请检查网络连接')
        } else if (err.message.includes('500')) {
          setError('服务器内部错误，请稍后重试')
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 初始加载
    fetchMetrics()

    // 设置每秒刷新
    const interval = setInterval(fetchMetrics, 3000)

    return () => clearInterval(interval)
  }, [fetchMetrics])

  return {
    data,
    loading,
    error,
    refetch: fetchMetrics,
  }
}
