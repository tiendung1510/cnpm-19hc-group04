import React, { Component } from 'react';
import { Layout } from 'antd';
import './Main.style.scss';
import links from '../../../constants/sidebar.constant';
import { withRouter, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { COOKIE_NAMES } from '../../../constants/cookie-name.constant';
import Toolbar from '../Toolbar/Toolbar';
import Sidebar from '../Sidebar/Sidebar';
import USER_ROLE from '../../../constants/user-role.constant';
import * as actions from '../../../redux/actions';
import { connect } from 'react-redux';

const { Footer, Content } = Layout;

class Main extends Component {
  cookies;

  componentWillMount() {
    this.checkLoggedInUser();
  }

  checkLoggedInUser() {
    this.cookies = this.props.cookies;
    const user = this.cookies.get(COOKIE_NAMES.user);
    const token = this.cookies.get(COOKIE_NAMES.token);

    if (!(user && token)) {
      this.cookies.remove(COOKIE_NAMES.token);
      this.cookies.remove(COOKIE_NAMES.user);
      window.location.href = '/login';
    } else {
      this.props.login(user, token);
    }
  }

  render() {
    const user = this.cookies.get(COOKIE_NAMES.user) || this.props.loggedInUser.user;
    const commonPages = [...links.find(link => link.role === USER_ROLE.USER.role).pages];
    const toolbarAvatarMenuItems = commonPages.filter((page, index) => index > 0);

    if (user.role === USER_ROLE.MANAGER.role)
      commonPages.length = 0;

    const userPagesByRole = commonPages.concat([
      ...links.find(link => link.role === user.role).pages]
      .concat(toolbarAvatarMenuItems));

    const PrivateRoute = ({ component: Component, ...rest }) => {
      return (
        <Route
          {...rest}
          render={props => <Component {...props} />}
        />
      )
    }

    const renderContents = () => {
      return (
        <div>
          {userPagesByRole.map((page, pageIndex) => {
            return (
              <PrivateRoute
                key={pageIndex}
                exact={true}
                component={page.component}
                path={`${page.path}`}
              />
            )
          })}
        </div>
      )
    }

    return (
      <div className="main">
        <Layout>
          <Sidebar user={user} userPagesByRole={userPagesByRole} />
          <Layout style={{ marginLeft: 200 }} className="animated fadeIn">
            <Toolbar user={user} avatarMenuItems={toolbarAvatarMenuItems} />
            <Content className="__content">
              <div className="__content__inner">
                {renderContents()}
              </div>
            </Content>
            <Footer className="__footer">
              Mini Mart &copy;2020 All right reserved.
            </Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser
})

export default connect(mapStateToProps, actions)(withCookies(withRouter(Main)));