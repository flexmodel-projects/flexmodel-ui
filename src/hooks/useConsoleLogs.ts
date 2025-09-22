import consoleWebSocketService, {ConsoleWebSocketMessage, LogEntry} from '@/services/console';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

interface UseConsoleLogsOptions {
  maxLogs?: number;
  autoScroll?: boolean;
}

interface UseConsoleLogsReturn {
  logs: LogEntry[];
  isConnected: boolean;
  connectionState: 'connecting' | 'open' | 'closing' | 'closed';
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  reconnect: () => void;
  error: string | null;
  logsEndRef: React.RefObject<HTMLDivElement>;
  setAutoScrollEnabled: (enabled: boolean) => void;
}

export const useConsoleLogs = (options: UseConsoleLogsOptions = {}): UseConsoleLogsReturn => {
  const { maxLogs = 500, autoScroll = true } = options; // 默认减少到500条

  // 按等级分别存储日志，确保每个等级独立计数与截断
  const [logsByLevel, setLogsByLevel] = useState<Record<LogEntry['level'], LogEntry[]>>({
    DEBUG: [],
    INFO: [],
    WARN: [],
    ERROR: []
  });

  // 合并各等级日志并按时间排序，供外部消费
  const logs: LogEntry[] = useMemo(() => {
    const merged = [
      ...logsByLevel.DEBUG,
      ...logsByLevel.INFO,
      ...logsByLevel.WARN,
      ...logsByLevel.ERROR
    ];
    // 时间戳格式为 yyyy-MM-dd HH:mm:ss.SSS，可直接按字符串升序
    return merged.sort((a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0));
  }, [logsByLevel]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'open' | 'closing' | 'closed'>('closed');
  const [error, setError] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const autoScrollEnabledRef = useRef<boolean>(autoScroll);
  const setAutoScrollEnabled = useCallback((enabled: boolean) => {
    autoScrollEnabledRef.current = enabled;
  }, []);

  // 添加日志
  const addLog = useCallback((log: LogEntry) => {
    setLogsByLevel(prev => {
      const level = log.level;
      const nextLevelLogs = [...prev[level], log];
      // 每个等级独立截断到 maxLogs
      const trimmedLevelLogs = nextLevelLogs.length > maxLogs ? nextLevelLogs.slice(-maxLogs) : nextLevelLogs;
      return {
        ...prev,
        [level]: trimmedLevelLogs
      };
    });
  }, [maxLogs]);

  // 清空日志
  const clearLogs = useCallback(() => {
    setLogsByLevel({ DEBUG: [], INFO: [], WARN: [], ERROR: [] });
  }, []);

  // 重连
  const reconnect = useCallback(() => {
    consoleWebSocketService.reconnect();
  }, []);

  // 自动滚动到底部 - 优化滚动性能
  const scrollToBottom = useCallback(() => {
    if (logsEndRef.current) {
      // 使用requestAnimationFrame优化滚动性能
      requestAnimationFrame(() => {
        if (logsEndRef.current) {
          logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, []);

  // 处理WebSocket消息
  const handleWebSocketMessage = useCallback((wsMessage: ConsoleWebSocketMessage) => {
    switch (wsMessage.type) {
      case 'connected':
        setIsConnected(true);
        setConnectionState('open');
        setError(null);
        console.log('Console连接已建立');
        break;

      case 'disconnected':
        setIsConnected(false);
        setConnectionState('closed');
        console.log('Console连接已断开');
        break;

      case 'log':
        if (wsMessage.data) {
          addLog(wsMessage.data);
        }
        break;

      case 'error':
        setError(wsMessage.message || '未知错误');
        console.error(wsMessage.message || 'Console连接错误');
        break;
    }
  }, [addLog]);

  // 订阅WebSocket消息
  useEffect(() => {
    const unsubscribe = consoleWebSocketService.subscribe(handleWebSocketMessage);

    // 初始化连接状态
    setConnectionState(consoleWebSocketService.getConnectionState());
    setIsConnected(consoleWebSocketService.isConnected());

    return unsubscribe;
  }, [handleWebSocketMessage]);

  // 自动滚动 - 在日志变化时滚动到底部（由外层根据 stayAtBottom/autoScrollEnabled 控制）
  useEffect(() => {
    if (logs.length > 0 && autoScrollEnabledRef.current) {
      scrollToBottom();
    }
  }, [logs.length, scrollToBottom]); // 只依赖logs.length而不是整个logs数组

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      // 注意：这里不调用disconnect()，因为WebSocket服务是单例，可能被其他组件使用
    };
  }, []);

  return {
    logs,
    isConnected,
    connectionState,
    addLog,
    clearLogs,
    reconnect,
    error,
    logsEndRef,
    setAutoScrollEnabled
  };
};
