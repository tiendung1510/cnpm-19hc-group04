import React, { Component } from 'react';
import { Row, Col, Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined, CaretDownFilled } from '@ant-design/icons';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { COOKIE_NAMES } from '../../../constants/cookie-name.constant';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import './Toolbar.style.scss';

class Toolbar extends Component {

  handleSelectMenuItem = (e) => {
    const code = e.split('***');
    const key = code[0];
    const path = code[1];

    if (key === 'LOGOUT') {
      this.logout();
      return;
    }

    this.props.history.push(path);
  }

  logout = () => {
    const { cookies } = this.props;
    cookies.remove(COOKIE_NAMES.token, { path: '/' });
    cookies.remove(COOKIE_NAMES.user, { path: '/' });
    this.props.history.length = 0;
    this.props.history.push('/login');
  }

  render() {
    const { user, avatarMenuItems } = this.props;
    const { currentPageTitle, currentPageIcon } = this.props.app;
    const CurrentPage = { Icon: currentPageIcon };

    return (
      <Row className="toolbar" justify="start" align="middle">
        <Col className="__page-title" span={16} xs={14} lg={16}>
          <Row align="center">
            <Col span={1} xs={2} lg={1}><div className="__page-title__icon"><CurrentPage.Icon /></div></Col>
            <Col span={23} xs={22} lg={23}><span className="__page-title__text">{currentPageTitle}</span></Col>
          </Row>
        </Col>
        <Col span={8} xs={10} lg={8}>
          <Row className="__account" justify="end" align="middle">
            <Col span={14}></Col>
            <Col span={10} align="end">
              <Dropdown
                overlay={
                  <Menu onClick={e => this.handleSelectMenuItem(e.key)}>
                    {(avatarMenuItems || []).map((item) => (
                      <Menu.Item key={item.key + '***' + item.path}
                        onClick={() => {
                          this.props.setCurrentPageTitle(item.title, item.icon);
                          this.props.setSidebarSelectedIndex(item.sidebarIndex);
                        }}>
                        <item.icon />
                        {item.title}
                      </Menu.Item>
                    ))}
                    <Menu.Item key="LOGOUT">
                      <LogoutOutlined />
                      Đăng xuất
                  </Menu.Item>
                  </Menu>
                }
                className="__account__avatar-menu"
              >
                <div>
                  <Avatar src={user.avatar} />
                  <span className="__account__avatar-menu__name">{user.fullname || ''}</span><CaretDownFilled style={{ color: 'white' }} />
                </div>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
});

export default connect(mapStateToProps, actions)(withCookies(withRouter(Toolbar)));
