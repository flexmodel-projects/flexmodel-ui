import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider, theme as antdTheme} from "antd";
import PageLayout from "./components/layouts/PageLayout.tsx";
import {useEffect} from "react";
import {useConfig, useLocale, useTheme} from "./store/appStore.ts";

const App = () => {
  const { fetchConfig } = useConfig();
  const { isDark } = useTheme();
  const { locale } = useLocale();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDark ? [antdTheme.darkAlgorithm, antdTheme.compactAlgorithm] : [antdTheme.compactAlgorithm],
        token: {
          borderRadius: 0,
          colorPrimary: '#096dd9',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: '#096dd9',
          colorLink: '#096dd9',
          colorLinkHover: '#40a9ff',
          colorLinkActive: '#0050b3',
        },
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
