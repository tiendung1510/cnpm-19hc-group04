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

const { Footer, Content } = Layout;

class Main extends Component {
  cookies;

  componentWillMount() {
    this.cookies = this.props.cookies;
    const user = this.cookies.get(COOKIE_NAMES.user);
    const token = this.cookies.get(COOKIE_NAMES.token);

    if (!(user && token)) {
      this.cookies.remove(COOKIE_NAMES.token);
      this.cookies.remove(COOKIE_NAMES.user);
      this.props.history.push('/login');
    }
  }
  render() {
    const user = {
      _id: 'be7a0cde-613e-11ea-bc55-0242ac130003',
      role: 'MANAGER',
      username: 'tuevo',
      password: 'asdasd',
      fullname: 'Tue Vo',
      email: 'tuevo.it@gmail.com',
      phone: '0932659211',
      dateOfBirth: new Date(),
      avatar: 'https://spon.mdp.ac.id/pluginfile.php/1/theme_moove/marketing1icon/1582524735/icon-lecture.png',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const userCommonPages = [...links.find(link => link.role === USER_ROLE.USER.role).pages];

    if (user.role === USER_ROLE.MANAGER.rol)
      userCommonPages.length = 0;

    const userPagesByRole = userCommonPages.concat([...links.find(link => link.role === user.role).pages]);

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
            <Toolbar user={user} userPagesByRole={userPagesByRole} />
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
export default withCookies(withRouter(Main));

