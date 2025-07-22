import React from "react";
import {Button, Layout, Row, Space, Tooltip} from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import {setLocale} from "../../actions/langAction.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configStore.ts";
import {useTranslation} from "react-i18next";
import {Locale} from "antd/es/locale";
import {FileSearchOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.locale);
  const { i18n } = useTranslation();

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
    <Layout.Header className={styles.root} style={{ background: '#fff', padding: 0, borderBottom: '1px solid #f5f5f5' }}>
      <Row justify="end" align="middle" style={{ height: 64 }}>
        <Space className="pr-[15px]">
          <Button
            size="small"
            type="default"
            onClick={() => changeLocale(locale == enUS ? zhCN : enUS)}
          >
            {locale == enUS ? "中文" : "English"}
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
