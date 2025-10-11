import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider, theme as antdTheme} from "antd";
import PageLayout from "./components/layouts/PageLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import {useEffect} from "react";
import {useConfig, useLocale, useTenant, useTheme} from "./store/appStore.ts";
import {useAuth} from "./store/authStore.ts";
import {initializeDarkMode} from "./utils/darkMode.ts";

const App = () => {
  const { fetchConfig } = useConfig();
  const { isDark } = useTheme();
  const { locale } = useLocale();
  const { isAuthenticated, getCurrentUser, refreshAuthToken } = useAuth();
  const { fetchTenants } = useTenant();

  useEffect(() => {
    // 初始化主题设置
    initializeDarkMode();
    fetchConfig();
  }, [fetchConfig]);

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated) {
        try {
          // 获取当前用户信息
          await getCurrentUser();
          // 获取租户列表
          await fetchTenants();
        } catch (error) {
          console.error('Failed to get current user:', error);
        }
      }
    };

    initializeAuth();
  }, [isAuthenticated, getCurrentUser, fetchTenants]);

  // 设置自动刷新token
  useEffect(() => {
    if (isAuthenticated) {
      // 每15分钟刷新一次token
      const interval = setInterval(() => {
        refreshAuthToken().catch(error => {
          console.error('Failed to refresh token:', error);
        });
      }, 15 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshAuthToken]);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDark ? [antdTheme.darkAlgorithm, antdTheme.compactAlgorithm] : [antdTheme.compactAlgorithm],
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <PageLayout/>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
