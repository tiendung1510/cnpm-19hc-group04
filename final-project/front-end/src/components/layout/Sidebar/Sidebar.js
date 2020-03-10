import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './Sidebar.style.scss';
import UserInfo from './UserInfo/UserInfo';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';

const { Sider } = Layout;

class Sidebar extends Component {
  pageIndex;

  componentWillMount() {
    const { userPagesByRole } = this.props;
    const href = window.location.href.split('?')[0];
    const position = href.split('/');
    const currentPath = position[position.length - 1];

    userPagesByRole.forEach((page, index) => {
      if (page.path === `/${currentPath}`) {
        this.pageIndex = index.toString();
        const currentPage = userPagesByRole[this.pageIndex];
        this.props.setCurrentPageTitle(currentPage.title, currentPage.icon);
      }
    });

    if (!this.pageIndex) {
      this.pageIndex = '0';
      const { title, icon, path } = userPagesByRole[this.pageIndex];
      this.props.history.push(path);
      this.props.setCurrentPageTitle(title, icon);
    }
  }

  render() {
    const { user, userPagesByRole } = this.props;

    return (
      <Sider className="sidebar">
        <UserInfo user={user} />
        <Menu theme='light' mode='inline' defaultSelectedKeys={[this.pageIndex]}>
          {userPagesByRole.map((page, pageIndex) => {
            const Page = { Icon: page.icon };
            return (
              <Menu.Item key={pageIndex} className="animated slideInLeft"
                onClick={() => { this.props.setCurrentPageTitle(page.title, page.icon) }}>
                <Page.Icon />
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
export default connect(null, actions)(withRouter(Sidebar));