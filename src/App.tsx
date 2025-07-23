import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider, theme as antdTheme} from "antd";
import PageLayout from "./components/layouts/PageLayout.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/configStore.ts";
import {useEffect, useState} from "react";
import {fetchConfig} from "./actions/configAction.ts";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  const {locale} = useSelector((state: RootState) => state.locale);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDark ? [antdTheme.darkAlgorithm] : [antdTheme.defaultAlgorithm],
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
