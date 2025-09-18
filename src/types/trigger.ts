// Quartz触发形式类型定义

export type TriggerFormType = 'interval' | 'cron' | 'daily_time_interval';

// 统一间隔触发配置（合并了SimpleTrigger和CalendarIntervalTrigger）
export interface IntervalTriggerConfig {
  interval: number; // 间隔值
  intervalUnit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'; // 间隔单位
  repeatCount?: number; // 重复次数，不设置表示无限重复
  timezone?: string; // 时区
}

// CronTrigger配置
export interface CronTriggerConfig {
  cronExpression: string; // Cron表达式
  timezone?: string; // 时区
}

// DailyTimeIntervalTrigger配置
export interface DailyTimeIntervalTriggerConfig {
  startTime: string; // 开始时间 (HH:mm:ss)
  endTime: string; // 结束时间 (HH:mm:ss)
  interval: number; // 间隔值
  intervalUnit: 'second' | 'minute' | 'hour'; // 间隔单位
  daysOfWeek: number[]; // 星期几 (1=周日, 2=周一, ..., 7=周六)
  timezone?: string; // 时区
}

// EventTrigger配置
export interface EventTriggerConfig {
  datasourceName: string; // 数据源名称
  modelName: string; // 模型名称
  mutationTypes: ('create' | 'update' | 'delete')[]; // 变更类型：增/删/改
  triggerTiming: 'before' | 'after'; // 触发时机：之前/之后
}

// 触发器配置联合类型
export type TriggerConfig = 
  | IntervalTriggerConfig 
  | CronTriggerConfig 
  | DailyTimeIntervalTriggerConfig
  | EventTriggerConfig;

// 触发器接口
export interface Trigger {
  id: string;
  name: string;
  description?: string;
  type: 'cron' | 'event';
  status: 'active' | 'inactive';
  flowId: string;
  flowName: string;
  triggerForm?: TriggerFormType; // 触发形式
  config: TriggerConfig & { triggerForm?: TriggerFormType }; // 配置中包含触发形式
  createdAt: string;
  updatedAt: string;
}

// 时区选项
export interface TimezoneOption {
  value: string;
  label: string;
}

// 常用的时区选项
export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (中国标准时间)' },
  { value: 'UTC', label: 'UTC (协调世界时)' },
  { value: 'America/New_York', label: 'America/New_York (美国东部时间)' },
  { value: 'Europe/London', label: 'Europe/London (英国时间)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (美国西部时间)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (欧洲中部时间)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (日本标准时间)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (澳大利亚东部时间)' }
];

// 星期几选项
export interface DayOfWeekOption {
  value: number;
  label: string;
}

export const DAYS_OF_WEEK: DayOfWeekOption[] = [
  { value: 1, label: 'trigger.sunday' },
  { value: 2, label: 'trigger.monday' },
  { value: 3, label: 'trigger.tuesday' },
  { value: 4, label: 'trigger.wednesday' },
  { value: 5, label: 'trigger.thursday' },
  { value: 6, label: 'trigger.friday' },
  { value: 7, label: 'trigger.saturday' }
];

// 间隔单位选项
export interface IntervalUnitOption {
  value: string;
  label: string;
}

export const INTERVAL_UNITS: IntervalUnitOption[] = [
  { value: 'second', label: 'trigger.interval_seconds' },
  { value: 'minute', label: 'trigger.interval_minutes' },
  { value: 'hour', label: 'trigger.interval_hours' },
  { value: 'day', label: 'trigger.interval_days' },
  { value: 'week', label: 'trigger.interval_weeks' },
  { value: 'month', label: 'trigger.interval_months' },
  { value: 'year', label: 'trigger.interval_years' }
];

// 每日时间间隔的间隔单位选项（限制为秒、分钟、小时）
export const DAILY_TIME_INTERVAL_UNITS: IntervalUnitOption[] = [
  { value: 'second', label: 'trigger.interval_seconds' },
  { value: 'minute', label: 'trigger.interval_minutes' },
  { value: 'hour', label: 'trigger.interval_hours' }
];

// 变更类型选项
export interface MutationTypeOption {
  value: 'create' | 'update' | 'delete';
  label: string;
}

export const MUTATION_TYPES: MutationTypeOption[] = [
  { value: 'create', label: 'trigger.mutation_create' },
  { value: 'update', label: 'trigger.mutation_update' },
  { value: 'delete', label: 'trigger.mutation_delete' }
];

// 触发时机选项
export interface TriggerTimingOption {
  value: 'before' | 'after';
  label: string;
}

export const TRIGGER_TIMINGS: TriggerTimingOption[] = [
  { value: 'before', label: 'trigger.timing_before' },
  { value: 'after', label: 'trigger.timing_after' }
];
