import React, {useEffect, useState} from "react";
import {Button, Layout, Row, Space, Tooltip} from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import {setLocale} from "../../actions/langAction.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configStore.ts";
import {useTranslation} from "react-i18next";
import {Locale} from "antd/es/locale";
import {FileSearchOutlined, GlobalOutlined, MoonOutlined, QuestionCircleOutlined, SunOutlined} from "@ant-design/icons";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);
  const { i18n } = useTranslation();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  const changeLocale = (localeValue: Locale) => {
    dispatch(setLocale(localeValue));
    i18n.changeLanguage(localeValue == zhCN ? "zh" : "en");
    if (!localeValue) {
      dayjs.locale("en");
    } else {
      dayjs.locale("zh-cn");
    }
  };

  return (
    <Layout.Header className="bg-white dark:bg-[#18181c] p-0 border-b border-[#f5f5f5] dark:border-[#23232a] shadow-sm dark:shadow-lg" style={{ padding: 0 }}>
      <Row justify="end" align="middle" style={{ height: 64 }}>
        <Space className="pr-[15px]">
          <Button
            size="small"
            type="default"
            onClick={() => changeLocale(locale == enUS ? zhCN : enUS)}
            icon={<GlobalOutlined />}
          >
            {locale == enUS ? "中文" : "English"}
          </Button>
          <Button
            size="small"
            type="default"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleDarkMode}
            style={{ marginRight: 8 }}
          >
            {isDark ? t("dark_mode") : t("light_mode")}
          </Button>
          <Tooltip title={t("api_document") as string}>
            <a href="/rapi-doc/index.html" target="_blank" rel="noopener noreferrer">
              <FileSearchOutlined className="text-lg" />
            </a>
          </Tooltip>
          <Tooltip title={t("help") as string}>
            <a href="https://flexmodel.wetech.tech" target="_blank" rel="noopener noreferrer">
              <QuestionCircleOutlined className="text-lg" />
            </a>
          </Tooltip>
        </Space>
      </Row>
    </Layout.Header>
  );
};

export default Header;
