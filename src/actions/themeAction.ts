export const setDarkMode = (isDark: boolean) => ({
  type: 'SET_DARK_MODE',
  payload: isDark,
});

export const toggleDarkMode = () => ({
  type: 'TOGGLE_DARK_MODE',
}); 