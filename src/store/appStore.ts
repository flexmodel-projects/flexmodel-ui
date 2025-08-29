import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {getSystemProfile} from '../services/system';
import {getDarkModeFromStorage} from '../utils/darkMode';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import {Message} from '@/components/ai-chatbox/types';

// 类型定义
export interface ConfigState {
  config: Record<string, any>;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeState {
  isDark: boolean;
}

export interface LocaleState {
  locale: typeof zhCN | typeof enUS;
  currentLang: 'zh' | 'en';
}

export interface SidebarState {
  isSidebarCollapsed: boolean;
}

export interface ChatState {
  messages: Message[];
}

export interface AppState extends ConfigState, ThemeState, LocaleState, SidebarState, ChatState {
  // 配置相关
  setConfig: (config: Record<string, any>) => void;
  fetchConfig: () => Promise<void>;
  setConfigLoading: (loading: boolean) => void;
  setConfigError: (error: string | null) => void;

  // 主题相关
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;

  // 语言相关
  setLocale: (locale: typeof zhCN | typeof enUS, lang: 'zh' | 'en') => void;
  toggleLanguage: () => void;

  // 侧边栏相关
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // 聊天相关
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

// 初始消息
const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '你好！👋 我是基于 Flexmodel 构建的AI助手。我可以和你聊天、回答问题，或者只是陪你解闷。\n\n试试问我：\n• "你好" - 打个招呼\n• "天气" - 聊聊天气\n• "时间" - 查看当前时间\n• "帮助" - 了解我的功能\n• "笑话" - 听个笑话\n• "技术" - 讨论技术话题\n\n有什么想聊的吗？😊',
    timestamp: new Date()
  }
];

// 创建store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        config: {},
        isLoading: false,
        error: null,
        isDark: getDarkModeFromStorage(),
        locale: localStorage.getItem('i18nextLng') === 'zh' ? zhCN : enUS,
        currentLang: (localStorage.getItem('i18nextLng') as 'zh' | 'en') || 'zh',
        isSidebarCollapsed: false, // 初始化侧边栏折叠状态
        messages: initialMessages, // 初始化消息

        // 配置相关actions
        setConfig: (config) => set({config}),
        setConfigLoading: (isLoading) => set({isLoading}),
        setConfigError: (error) => set({error}),
        fetchConfig: async () => {
          set({isLoading: true, error: null});
          try {
            const profile = await getSystemProfile();
            set({config: profile.settings, isLoading: false});
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : '获取配置失败',
              isLoading: false
            });
          }
        },

        // 主题相关actions
        setDarkMode: (isDark) => {
          set({isDark});
          localStorage.setItem('darkMode', isDark.toString());
        },
        toggleDarkMode: () => {
          const {isDark} = get();
          const newDarkMode = !isDark;
          set({isDark: newDarkMode});
          localStorage.setItem('darkMode', newDarkMode.toString());
        },

        // 语言相关actions
        setLocale: (locale, lang) => {
          set({locale, currentLang: lang});
          localStorage.setItem('i18nextLng', lang);
        },
        toggleLanguage: () => {
          const {currentLang} = get();
          const newLang = currentLang === 'zh' ? 'en' : 'zh';
          const newLocale = newLang === 'zh' ? zhCN : enUS;
          set({locale: newLocale, currentLang: newLang});
          localStorage.setItem('i18nextLng', newLang);
        },

        // 侧边栏相关actions
        setSidebarCollapsed: (collapsed) => {
          set({isSidebarCollapsed: collapsed});
        },
        toggleSidebar: () => {
          const {isSidebarCollapsed} = get();
          const newCollapsed = !isSidebarCollapsed;
          set({isSidebarCollapsed: newCollapsed});
        },

        // 聊天相关actions
        setMessages: (messages) => set({messages}),
        addMessage: (message) => {
          const {messages} = get();
          set({messages: [...messages, message]});
        },
        clearMessages: () => set({messages: initialMessages}),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          isDark: state.isDark,
          currentLang: state.currentLang,
          isSidebarCollapsed: state.isSidebarCollapsed,
          messages: state.messages,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);

// 导出选择器hooks
export const useConfig = () => useAppStore((state) => ({
  config: state.config,
  isLoading: state.isLoading,
  error: state.error,
  setConfig: state.setConfig,
  fetchConfig: state.fetchConfig,
}));

export const useTheme = () => useAppStore((state) => ({
  isDark: state.isDark,
  setDarkMode: state.setDarkMode,
  toggleDarkMode: state.toggleDarkMode,
}));

export const useLocale = () => useAppStore((state) => ({
  locale: state.locale,
  currentLang: state.currentLang,
  setLocale: state.setLocale,
  toggleLanguage: state.toggleLanguage,
}));

export const useSidebar = () => useAppStore((state) => ({
  isSidebarCollapsed: state.isSidebarCollapsed,
  setSidebarCollapsed: state.setSidebarCollapsed,
  toggleSidebar: state.toggleSidebar,
}));
