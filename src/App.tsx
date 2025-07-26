import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider, theme as antdTheme} from "antd";
import PageLayout from "./components/layouts/PageLayout.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/configStore.ts";
import {useEffect, useState} from "react";
import {fetchConfig} from "./actions/configAction.ts";
import {initializeDarkMode} from "./utils/darkMode.ts";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  const {locale} = useSelector((state: RootState) => state.locale);
  const [isDark, setIsDark] = useState(() => initializeDarkMode());
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
      componentSize="small"
      theme={{
        algorithm: isDark ? [antdTheme.darkAlgorithm] : [antdTheme.defaultAlgorithm],
        token: {
          // 紧凑主题配置
          borderRadius: 4,
          borderRadiusLG: 6,
          borderRadiusSM: 2,
          borderRadiusXS: 1,
          
          // 间距 token
          padding: 12,
          paddingLG: 16,
          paddingMD: 12,
          paddingSM: 8,
          paddingXS: 4,
          paddingXXS: 2,
          
          // 边距 token
          margin: 12,
          marginLG: 16,
          marginMD: 12,
          marginSM: 8,
          marginXS: 4,
          marginXXS: 2,
          
          // 组件间距
          controlHeight: 28,
          controlHeightLG: 32,
          controlHeightSM: 24,
          
          // 字体大小
          fontSize: 12,
          fontSizeLG: 14,
          fontSizeSM: 11,
          fontSizeXL: 16,
          
          // 行高
          lineHeight: 1.5714,
          lineHeightLG: 1.5,
          lineHeightSM: 1.6667,
          
          // 组件间距
          sizeUnit: 4,
          sizeStep: 4,
        },
        components: {
          // Card 组件紧凑配置
          Card: {
            paddingLG: 16,
            padding: 12,
            paddingSM: 8,
            borderRadiusLG: 6,
            borderRadius: 4,
          },
          // Layout 组件紧凑配置
          Layout: {
            headerHeight: 48,
            headerPadding: '0 12px',
            siderBg: isDark ? '#1f1f23' : '#fff',
            bodyBg: isDark ? '#141414' : '#f5f5f5',
          },
          // Menu 组件紧凑配置
          Menu: {
            itemHeight: 36,
            itemPaddingInline: 12,
            itemMarginInline: 4,
            itemBorderRadius: 4,
            itemSelectedBg: isDark ? '#177ddc' : '#e6f4ff',
            itemSelectedColor: isDark ? '#ffffff' : '#1677ff',
            itemHoverBg: isDark ? '#1f1f23' : '#f5f5f5',
          },
          // Button 组件紧凑配置
          Button: {
            paddingInline: 12,
            paddingBlock: 4,
            borderRadius: 4,
            controlHeight: 28,
            controlHeightLG: 32,
            controlHeightSM: 24,
          },
          // Input 组件紧凑配置
          Input: {
            paddingInline: 8,
            paddingBlock: 4,
            borderRadius: 4,
            controlHeight: 28,
            controlHeightLG: 32,
            controlHeightSM: 24,
          },
          // Table 组件紧凑配置
          Table: {
            padding: 8,
            paddingLG: 12,
            paddingSM: 4,
            borderRadius: 4,
            headerBg: isDark ? '#1f1f23' : '#fafafa',
            headerColor: isDark ? '#ffffff' : '#262626',
          },
          // Form 组件紧凑配置
          Form: {
            itemMarginBottom: 16,
            labelHeight: 28,
          },
          // Modal 组件紧凑配置
          Modal: {
            padding: 16,
            paddingLG: 20,
            paddingSM: 12,
            borderRadius: 6,
            borderRadiusLG: 8,
            borderRadiusSM: 4,
          },
          // Drawer 组件紧凑配置
          Drawer: {
            padding: 16,
            paddingLG: 20,
            paddingSM: 12,
            borderRadius: 6,
            borderRadiusLG: 8,
            borderRadiusSM: 4,
          },
          // Dropdown 组件紧凑配置
          Dropdown: {
            borderRadius: 4,
            borderRadiusLG: 6,
            borderRadiusSM: 2,
          },
          // Tooltip 组件紧凑配置
          Tooltip: {
            borderRadius: 4,
            borderRadiusLG: 6,
            borderRadiusSM: 2,
          },
          // Notification 组件紧凑配置
          Notification: {
            borderRadius: 4,
            borderRadiusLG: 6,
            borderRadiusSM: 2,
            padding: 12,
            paddingLG: 16,
            paddingSM: 8,
          },
          // Message 组件紧凑配置
          Message: {
            borderRadius: 4,
            borderRadiusLG: 6,
            borderRadiusSM: 2,
            padding: 8,
            paddingLG: 12,
            paddingSM: 4,
          },
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
