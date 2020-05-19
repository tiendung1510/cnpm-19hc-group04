import { ArrowLeftOutlined, CaretRightFilled, MenuOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { COOKIE_NAMES } from '../../../constants/cookie-name.constant';
import { default as links, default as SIDEBAR } from '../../../constants/sidebar.constant';
import USER_ROLES from '../../../constants/user-role.constant';
import * as actions from '../../../redux/actions';
import './Sidebar.style.scss';
import UserInfo from './UserInfo/UserInfo';

const { Sider } = Layout;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggled: false
    }
  }
  componentDidMount() {
    const { pagesByUserRole } = this.props;
    const href = window.location.href.split('?')[0];
    const position = href.split('/');
    const currentPath = position[position.length - 1];

    if (currentPath) {
      pagesByUserRole.forEach((page, index) => {
        if (page.path === `/${currentPath}`) {
          const currentPage = pagesByUserRole[index];
          this.props.setSidebarSelectedIndex(index);
          this.props.setCurrentPageTitle(currentPage.title, currentPage.icon);
        }
      });
    } else {
      const user = this.props.cookies.get(COOKIE_NAMES.user);
      let page = {};
      if (user.role === USER_ROLES.CASHIER.type) {
        page = SIDEBAR[1].pages[0];
      }

      if (user.role === USER_ROLES.IMPORTER.type) {
        page = SIDEBAR[2].pages[0];
      }

      if (user.role === USER_ROLES.MANAGER.type) {
        page = SIDEBAR[3].pages[0];
      }

      this.props.setSidebarSelectedIndex(0);
      this.props.setCurrentPageTitle(page.title, page.icon);
      this.props.history.length = 0;
      this.props.history.push(page.path);
    }
  }

  isCommonPage(path) {
    const page = links.find(link => link.role === USER_ROLES.USER.type).pages.find(page => page.path === path);
    if (page)
      return true;
    return false;
  }

  render() {
    const { user, pagesByUserRole } = this.props;
    const { sidebarSelectedIndex } = this.props.app;
    const { isToggled } = this.state;
    const isMobile = window.innerWidth <= 992;

    return (
      <div className="sidebar-container">
        <Button
          className={isMobile && !isToggled ? 'sidebar__btn-toggle animated slideInLeft' : 'sidebar__btn-toggle--hidden'}
          icon={<MenuOutlined />}
          onClick={() => this.setState({ isToggled: true })}
        />
        <Sider className={(isToggled && isMobile) || !isMobile ? 'sidebar animated slideInLeft' : 'sidebar--hidden'}>
          <div className="sidebar__header">
            <img className="sidebar__header__company-logo" src={require('../../../assets/images/app-logo.png')} alt="logo" />
            <div className="sidebar__header__company-brand">
              <div className="sidebar__header__company-brand__name"><span>Mini Mart</span></div>
              <div className="sidebar__header__company-brand__slogan"><span>Tiện Lợi mà Chất Lượng</span></div>
            </div>
            <Button
              shape="circle"
              icon={<ArrowLeftOutlined />}
              className={isMobile ? 'sidebar__btn-hide' : 'sidebar__btn-hide--hidden'}
              onClick={() => this.setState({ isToggled: false })}
            />
          </div>
          <UserInfo user={user} />
          <Menu
            theme='light'
            mode='inline'
            selectedKeys={[sidebarSelectedIndex ? sidebarSelectedIndex.toString() : '0']}>
            {pagesByUserRole.map((page, pageIndex) => {
              const Page = { Icon: page.icon };
              return (
                <Menu.Item key={pageIndex}
                  onClick={() => {
                    this.props.setCurrentPageTitle(page.title, page.icon);
                    this.props.setSidebarSelectedIndex(pageIndex);
                    this.setState({ isToggled: false });

                    const user = this.props.cookies.get(COOKIE_NAMES.user);
                    if (!user) {
                      this.props.history.push('/login');
                    }
                  }}>
                  <Page.Icon style={{ color: '#ff8220' }} />
                  <span className="sidebar__nav-title">{page.title}</span>
                  <Link to={page.path} />
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  app: state.app
});

export default connect(mapStateToProps, actions)(withCookies(withRouter(Sidebar)));