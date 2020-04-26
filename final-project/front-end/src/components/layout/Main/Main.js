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

const { Content } = Layout;

class Main extends Component {
  constructor(props) {
    super(props);
    const loggedUser = this.props.cookies.get(COOKIE_NAMES.user);
    const token = this.props.cookies.get(COOKIE_NAMES.token);
    if (!(loggedUser && token)) {
      this.isAuthenticated = false;
      this.props.history.length = 0;
      this.props.history.push('/login');
    } else {
      this.isAuthenticated = true;
    }
  }
  render() {
    if (!this.isAuthenticated)
      return null;

    const user = this.props.cookies.get(COOKIE_NAMES.user) || this.props.loggedInUser.user;
    let pagesByUserRole = links.find(link => link.role === user.role).pages;
    const commonPages = links.find(link => link.role === USER_ROLE.USER.type).pages
      .map((page, index) => ({ ...page, sidebarIndex: pagesByUserRole.length + index }));
    pagesByUserRole = [...pagesByUserRole].concat(commonPages);

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
          {pagesByUserRole.map((page, pageIndex) => {
            return (
              <PrivateRoute
                key={pageIndex}
                exact={true}
                component={page.component}
                path={page.path}
              />
            )
          })}
        </div>
      )
    }

    return (
      <div className="main">
        <Layout>
          <Sidebar user={user} pagesByUserRole={pagesByUserRole} />
          <Layout style={{ marginLeft: 200 }}>
            <div style={{ position: 'relative' }}>
              <Toolbar user={user} avatarMenuItems={commonPages} />
            </div>
            <Content className="main__content">
              {renderContents()}
            </Content>
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