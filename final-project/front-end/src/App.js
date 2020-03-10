import React, { Component } from 'react'
import 'antd/dist/antd.scss';
import './assets/styles/animate.min.css';
import Login from './components/pages/User/Login/Login';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Main from './components/layout/Main/Main';

export default class App extends Component {

  render() {
    return (
      <CookiesProvider>
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/' component={Main} />
            <Route
              path='/**'
              render={() => {
                return (
                  <Redirect
                    to={{
                      pathname: '/'
                    }}
                  />
                );
              }}
            />
          </Switch>
        </BrowserRouter>
      </CookiesProvider>
    )
  }
}
