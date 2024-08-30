import * as React from 'react';
import {Col, Layout, Menu, Row} from 'antd';
import * as Icons from '@ant-design/icons';
import {Link} from 'react-router-dom';
import './Sidebar.css';

interface SidebarState {
  collapsed: boolean;
  mode: "vertical" | "inline" | "horizontal" | undefined;
  selectedKey: string;
}

interface SidebarProps {
  defaultSelectedKey?: string;
}

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      collapsed: false,
      mode: "inline",
      selectedKey: this.props.defaultSelectedKey || "1"
    };
  }

  public render() {
    return (
      <Layout.Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>
        <div className="ant-layout-logo">
          <Row align="middle">
            <Col>
              <img src="/logo.svg" width="40px" alt="logo"/>
            </Col>
            {this.state.collapsed ? '' : <Col>
              <span style={{fontSize: "20px", padding: '10px', color: "#eee"}}>Flexmodel</span>
            </Col>}
          </Row>
        </div>
        <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={[this.state.selectedKey]}>
          <Menu.Item key="/home">
            <Link to="/home">
              <Icons.HomeOutlined/>
              <span className="nav-text">Home</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/todo">
            <Link to="/todo">
              <Icons.CheckSquareOutlined/>
              <span className="nav-text">Todo</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <Link to="/about">
              <Icons.FileOutlined/>
              <span className="nav-text">About</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/datasource">
            <Link to="/datasource">
              <Icons.FileOutlined/>
              <span className="nav-text">Data source</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/api-management">
            <Link to="/api-management">
              <Icons.FileOutlined/>
              <span className="nav-text">Api Design</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
    );
  }

  private toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: !this.state.collapsed ? "vertical" : "inline",
    });
  }
}

export default Sidebar;
