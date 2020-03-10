import React, { Component } from 'react';
import { Row, Col, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { COOKIE_NAMES } from '../../../constants/cookie-name.constant';
import './Toolbar.style.scss';

class Toolbar extends Component {

  hanleSelectMenuItem = key => {
    switch (key) {
      case 'LOGOUT':
        this.logout();
        break;

      default:
        break;
    }
  }

  logout = () => {
    const { cookies } = this.props;
    cookies.remove(COOKIE_NAMES.token);
    cookies.remove(COOKIE_NAMES.user);
    this.props.history.push('/login');
  }

  render() {
    const { user } = this.props;

    return (
      <Row className="toolbar" justify="start" align="middle">
        <Col className="__page-name" span={18}>PAGE NAME</Col>
        <Col span={6}>
          <Row className="__account" justify="center" align="middle">
            <Col span={14}>
              ACCOUNT FEATURES
            </Col>
            <Col span={10}>
              <Dropdown overlay={
                <Menu onClick={e => this.hanleSelectMenuItem(e.key)}>
                  <Menu.Item key="PROFILE">
                    <UserOutlined />
                    Thông tin cá nhân
                  </Menu.Item>
                  <Menu.Item key="CHANGE_PASSWORD">
                    <LockOutlined />
                    Đổi mật khẩu
                  </Menu.Item>
                  <Menu.Item key="LOGOUT">
                    <LogoutOutlined />
                    Đăng xuất
                  </Menu.Item>
                </Menu>
              } className="__account__more-feature">
                <Row align="middle">
                  <Col span={7}><Avatar size="default" src={user.avatar} /></Col>
                  <Col span={17}><span>{user.fullname || ''}</span></Col>
                </Row>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
export default withCookies(withRouter(Toolbar));
