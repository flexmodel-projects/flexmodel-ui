import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider, theme as antdTheme} from "antd";
import PageLayout from "./components/layouts/PageLayout";
import {useEffect} from "react";
import {useConfig, useLocale, useTheme} from "./store/appStore.ts";
import {initializeDarkMode} from "./utils/darkMode.ts";

const App = () => {
  const { fetchConfig } = useConfig();
  const { isDark } = useTheme();
  const { locale } = useLocale();

  useEffect(() => {
    // 初始化主题设置
    initializeDarkMode();
    fetchConfig();
  }, [fetchConfig]);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDark ? [antdTheme.darkAlgorithm, antdTheme.compactAlgorithm] : [antdTheme.compactAlgorithm],
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/*" element={<PageLayout/>}/>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
