import * as React from "react";
import {Col, Layout, Radio, RadioChangeEvent, Row,} from "antd";
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import dayjs from "dayjs";
import {setLocale} from "../../actions/langAction.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configStore.ts";

export const Header: React.FC<unknown> = () => {
  const dispatch = useDispatch();
  const {locale} = useSelector((state: RootState) => state.locale);
  const changeLocale = (e: RadioChangeEvent) => {
    const localeValue = e.target.value;
    dispatch(setLocale(localeValue));
    if (!localeValue) {
      dayjs.locale('en');
    } else {
      dayjs.locale('zh-cn');
    }
  };

  return (
    <Layout.Header style={{background: "#fff", padding: 0}}>
      <Row justify="end" align="middle">
        <Col span={3}>
          <Radio.Group value={locale} onChange={changeLocale}>
            <Radio.Button key="en" value={enUS}>
              English
            </Radio.Button>
            <Radio.Button key="cn" value={zhCN}>
              中文
            </Radio.Button>
          </Radio.Group>
          {/*<Menu mode="horizontal">
              <Menu.SubMenu title={<span><UserOutlined/>{"User 1"}</span>}>
                <Menu.Item key="logOut"><Link to="#">Logout</Link></Menu.Item>
              </Menu.SubMenu>
            </Menu>*/}
        </Col>
      </Row>
    </Layout.Header>
  );
};
