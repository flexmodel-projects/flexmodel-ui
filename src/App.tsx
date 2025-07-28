import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider, theme as antdTheme} from "antd";
import PageLayout from "./components/layouts/PageLayout.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/configStore.ts";
import {useEffect} from "react";
import {fetchConfig} from "./actions/configAction.ts";
import {setDarkMode} from "./actions/themeAction.ts";
import {initializeDarkMode} from "./utils/darkMode.ts";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  const {locale} = useSelector((state: RootState) => state.locale);
  const {isDark} = useSelector((state: RootState) => state.theme);
  
  useEffect(() => {
    dispatch(fetchConfig());
    // 初始化夜间模式状态
    const initialDarkMode = initializeDarkMode();
    dispatch(setDarkMode(initialDarkMode));
  }, [dispatch]);

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
