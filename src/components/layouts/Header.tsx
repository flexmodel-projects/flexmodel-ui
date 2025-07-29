import React, {useCallback, useMemo} from "react";
import {Breadcrumb, Button, Dropdown, Layout, Menu, Row, Space, Switch, theme, Tooltip} from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import {useLocale, useTheme} from "@/store/appStore.ts";
import {useTranslation} from "react-i18next";
import {Locale} from "antd/es/locale";
import {
  FileSearchOutlined,
  GlobalOutlined,
  HomeOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SunOutlined
} from "@ant-design/icons";
import {applyDarkMode, setDarkModeToStorage} from "@/utils/darkMode.ts";
import {useLocation} from "react-router-dom";
import {getFullRoutePath} from "@/routes.tsx";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { isDark, toggleDarkMode: toggleDarkModeStore } = useTheme();
  const {setLocale: setLocaleStore, currentLang } = useLocale();
  const { i18n } = useTranslation();
  const location = useLocation();
  const { token } = theme.useToken();

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDark;
    applyDarkMode(newDarkMode);
    setDarkModeToStorage(newDarkMode);
    toggleDarkModeStore();
  }, [isDark, toggleDarkModeStore]);

  const changeLocale = useCallback((localeValue: Locale) => {
    const lang = localeValue === zhCN ? 'zh' : 'en';
    setLocaleStore(localeValue, lang);
    i18n.changeLanguage(lang);
    if (lang === 'zh') {
      dayjs.locale("zh-cn");
    } else {
      dayjs.locale("en");
    }
  }, [setLocaleStore, i18n]);

  // 使用 useMemo 缓存面包屑数据，避免每次渲染都重新计算
  const breadcrumbItems = useMemo(() => {
    const pathname = location.pathname;
    const items = [];

    // 添加首页
    items.push({
      title: <HomeOutlined />,
      href: "/"
    });

    // 获取完整的路由路径（包括父路由和子路由）
    const fullRoutePath = getFullRoutePath(pathname);

    // 为每个路由段生成面包屑项
    fullRoutePath.forEach((route) => {
      const IconComponent = route.icon;

      items.push({
        title: (
          <span>
            <IconComponent style={{ marginRight: token.marginXS }} />
            {t(route.translationKey)}
          </span>
        )
        // 移除 href 属性，使面包屑不可点击
      });
    });

    return items;
  }, [location.pathname, t, token.marginXS]);

  // 使用 useMemo 缓存语言菜单
  const localeMenu = useMemo(() => (
    <Menu>
      <Menu.Item key="zh" onClick={() => changeLocale(zhCN)}>
        中文
      </Menu.Item>
      <Menu.Item key="en" onClick={() => changeLocale(enUS)}>
        English
      </Menu.Item>
    </Menu>
  ), [changeLocale]);

  // 使用 useMemo 缓存当前语言显示文本
  const currentLocaleText = useMemo(() =>
    currentLang === 'zh' ? "中文" : "English",
    [currentLang]
  );

  return (
    <Layout.Header
      className="bg-white dark:bg-[#18181c] border-b border-[#f5f5f5] dark:border-[#23232a] shadow-sm dark:shadow-lg"
      style={{
        padding: 0,
        height: token.controlHeight * 1.5,
        lineHeight: `${token.controlHeight * 1.5}px`
      }}
    >
      <Row justify="space-between" align="middle" style={{ height: '100%' }}>
        {/* 左侧面包屑 */}
        <div style={{ paddingLeft: token.padding }}>
          <Breadcrumb
            items={breadcrumbItems}
          />
        </div>

        {/* 右侧功能按钮 */}
        <Space style={{ paddingRight: token.padding }} size={token.marginLG}>
          <Space size={token.marginSM}>
            <Switch
              checked={isDark}
              onChange={toggleDarkMode}
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
              style={{ marginRight: token.marginXS }}
            />
            <Dropdown
              overlay={localeMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button size="small" type="default" icon={<GlobalOutlined />}>{currentLocaleText}</Button>
            </Dropdown>
            <Tooltip title={t("api_document") as string}>
              <a href={`${import.meta.env.BASE_URL}/rapi-doc/index.html`} target="_blank" rel="noopener noreferrer">
                <FileSearchOutlined style={{ fontSize: token.fontSizeLG }} />
              </a>
            </Tooltip>
            <Tooltip title={t("help") as string}>
              <a href="https://flexmodel.wetech.tech" target="_blank" rel="noopener noreferrer">
                <QuestionCircleOutlined style={{ fontSize: token.fontSizeLG }} />
              </a>
            </Tooltip>
          </Space>
        </Space>
      </Row>
    </Layout.Header>
  );
};

export default React.memo(Header);
