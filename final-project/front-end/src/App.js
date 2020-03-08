import React, { Component } from 'react'
import 'antd/dist/antd.css';
import './assets/styles/animate.min.css';
import Login from './components/authentication/Login/Login';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

export default class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/**' component={Login} />
        </Switch>
      </BrowserRouter>
    )
  }
}
