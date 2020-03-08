import React, { Component } from 'react';
import { Layout } from 'antd';
import './Main.style.scss';
import links from '../../../constants/sidebar.constant';
import { Redirect, withRouter, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import Toolbar from '../Toolbar/Toolbar';
import Sidebar from '../Sidebar/Sidebar';

const { Footer, Content } = Layout;

class Main extends Component {
  isAuthenticated;

  constructor(props) {
    super(props);
    this.isAuthenticated = false;
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
      avatar: 'https://lh3.googleusercontent.com/a-/AAuE7mAr1etk5y5fnv3eDpJVxiapio6o8mkKDs1qQtCBiQ=s50',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const userCommonPages = [...links.find(link => link.role === 'USER').pages];

    if (user.role === 'MANAGER')
      userCommonPages.length = 0;

    const userPagesByRole = userCommonPages.concat([...links.find(link => link.role === user.role).pages]);

    const PrivateRoute = ({ component: Component, ...rest }) => {
      return (
        <Route
          {...rest}
          render={props =>
            this.isAuthenticated ? (
              <Component {...props} />
            ) : (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: props.location }
                  }}
                />
              )
          }
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

