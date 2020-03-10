import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './Sidebar.style.scss';
import UserInfo from './UserInfo/UserInfo';

const { Sider } = Layout;

class Sidebar extends Component {
  render() {
    const { user, userPagesByRole } = this.props;

    const href = window.location.href.split('?')[0];
    const position = href.split('/');
    const currentPath = position[position.length - 1];
    let pageIndex;
    userPagesByRole.forEach((page, index) => {
      if (page.path === `/${currentPath}`)
        pageIndex = index.toString();
    });

    // if (!pageIndex) {
    //   window.location.href = userPagesByRole[0].path;
    // }

    return (
      <Sider className="sidebar">
        <UserInfo user={user} />
        <Menu theme='light' mode='inline' defaultSelectedKeys={[pageIndex]}>
          {userPagesByRole.map((page, pageIndex) => {
            return (
              <Menu.Item key={pageIndex} className="animated slideInLeft">
                <page.icon />
                <span className='nav-text'>{page.title}</span>
                <Link to={page.path} />
              </Menu.Item>
            )
          })}
        </Menu>
      </Sider>
    )
  }
}
export default withRouter(Sidebar);