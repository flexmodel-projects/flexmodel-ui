import * as React from "react";
import {Button, Layout, Row, Space, Tooltip,} from "antd";
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import dayjs from "dayjs";
import {setLocale} from "../../actions/langAction.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configStore.ts";
import {useTranslation} from "react-i18next";
import {Locale} from "antd/es/locale";
import {QuestionCircleOutlined} from "@ant-design/icons";

export const Header: React.FC<unknown> = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {locale} = useSelector((state: RootState) => state.locale);
  const {i18n} = useTranslation();
  const changeLocale = (localeValue: Locale) => {
    dispatch(setLocale(localeValue));
    i18n.changeLanguage(localeValue == zhCN ? 'zh' : 'en');
    if (!localeValue) {
      dayjs.locale('en');
    } else {
      dayjs.locale('zh-cn');
    }
  };

  return (
    <Layout.Header style={{background: "#fff", padding: 0}}>
      <Row justify="end" align="middle">
        <Space style={{paddingRight: '15px'}}>
          <Button size="small" color="primary" variant="outlined"
                  onClick={() => changeLocale(locale == enUS ? zhCN : enUS)}>
            {locale == enUS ? '中文' : 'English'}
          </Button>
          <Tooltip title={t('help')}>
            <a href="https://flexmodel.wetech.tech" target="_blank">
              <Button type="text" shape="circle" icon={<QuestionCircleOutlined/>}/>
            </a>
          </Tooltip>
        </Space>
      </Row>
    </Layout.Header>
  );
};
