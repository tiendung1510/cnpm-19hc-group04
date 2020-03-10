import React, { Component } from 'react';
import './AppLoading.style.scss';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import * as actions from '../../../redux/actions';
import { connect } from 'react-redux';

class AppLoading extends Component {
  render() {
    return (
      this.props.app.isLoading ? (
        <div className="app-loading">
          <Spin indicator={(<LoadingOutlined style={{ fontSize: 24 }} spin />)} />
        </div>
      ) : <></>
    )
  }
}

const mapStateToProps = (state) => ({
  app: state.app
});

export default connect(mapStateToProps, actions)(AppLoading);
