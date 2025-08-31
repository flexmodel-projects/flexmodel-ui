const DARK_MODE_KEY = 'darkMode';

export const getDarkModeFromStorage = (): boolean => {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    // 如果本地存储中没有保存过设置，默认使用暗色模式
    if (stored === null) {
      return true;
    }
    return stored === 'true';
  } catch (error) {
    console.warn('Failed to read dark mode from localStorage:', error);
    return true; // 出错时也默认使用暗色模式
  }
};

export const setDarkModeToStorage = (isDark: boolean): void => {
  try {
    localStorage.setItem(DARK_MODE_KEY, isDark.toString());
  } catch (error) {
    console.warn('Failed to save dark mode to localStorage:', error);
  }
};

export const applyDarkMode = (isDark: boolean): void => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const initializeDarkMode = (): boolean => {
  const isDark = getDarkModeFromStorage();
  applyDarkMode(isDark);
  return isDark;
}; 