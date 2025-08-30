import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {getGlobalProfile} from '../services/global';
import {getDarkModeFromStorage} from '../utils/darkMode';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

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

export interface AppState extends ConfigState, ThemeState, LocaleState, SidebarState {
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
}

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

        // 配置相关actions
        setConfig: (config) => set({config}),
        setConfigLoading: (isLoading) => set({isLoading}),
        setConfigError: (error) => set({error}),
        fetchConfig: async () => {
          set({isLoading: true, error: null});
          try {
            const profile = await getGlobalProfile();
            set({config: {...profile.settings, apiRootPath: profile.apiRootPath}, isLoading: false});
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
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          isDark: state.isDark,
          currentLang: state.currentLang,
          isSidebarCollapsed: state.isSidebarCollapsed,
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
