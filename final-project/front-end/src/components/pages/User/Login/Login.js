import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Tooltip, message } from 'antd';
import './Login.style.scss';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { API } from '../../../../constants/api.constant';
import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/actions';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

class Login extends Component {

  componentDidMount() {
    const { cookies } = this.props;
    const user = cookies.get(COOKIE_NAMES.user);
    const token = cookies.get(COOKIE_NAMES.token);
    if (user && token)
      this.props.history.push('/');
  }

  login = async (values) => {
    this.props.setAppLoading(true);
    const params = {
      username: values.username,
      password: values.password
    };

    const res = await (await fetch(API.User.login, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })).json();

    this.props.setAppLoading(false);

    if (res.status !== 200) {
      message.error(res.errors[0]);
      return;
    }

    const user = res.data.user;
    const token = res.data.meta.token;

    this.props.login(user, token);

    const { cookies } = this.props;
    cookies.set(COOKIE_NAMES.user, user, { path: '/' });
    cookies.set(COOKIE_NAMES.token, token, { path: '/' });
    window.location.href = '/';
  };

  render() {
    return (
      <div className="container">
        <div className="dark-bg"></div>
        <div className="login animated slideInUp">
          <div className="__header">
            <img className="__company-logo" src={require('../../../../assets/images/app-logo.png')} alt="logo" />
            <div className="__company-brand">
              <div className="__name"><span>Mini Mart</span></div>
              <div className="__slogan"><span>Tiện Lợi mà Chất Lượng</span></div>
            </div>
          </div>
          <Row className="__content">
            <Col span={11}>
              <div className="__staff-symbol">
                <img src={require('../../../../assets/images/staffs.png')} alt="staffs" />
              </div>
            </Col>
            <Col span={13}>
              <p className="__main-title">QUẢN LÝ MINI MART</p>
              <Form
                className="__form"
                {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                onFinish={this.login}
                onFinishFailed={() => { message.error('Vui lòng nhập đầy đủ thông tin'); }}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tài khoản!',
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined className="__form__icon" />} placeholder="Tài khoản" autoFocus={true} />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mật khẩu!',
                    },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined className="__form__icon" />} placeholder="Mật khẩu" />
                </Form.Item>

                <div className="__form__forgot-password">
                  <Tooltip title="Yêu cầu khôi phục mật khẩu">
                    <a href="/login" style={{ marginLeft: 8 }}>
                      Quên mật khẩu?
                    </a>
                  </Tooltip>
                </div>

                <Form.Item {...tailLayout}>
                  <Button className="__form__btn-submit" type="primary" htmlType="submit">
                    ĐĂNG NHẬP
                  </Button>
                </Form.Item>

              </Form>
            </Col>
          </Row>

          <p className="__footer">Mini Mart &copy;2020 All right reserved.</p>
        </div>

        <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="url(#my-cool-gradient)" fillOpacity={1} d="M0,160L1440,0L1440,320L0,320Z" />
          <linearGradient id="my-cool-gradient" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff5858" />
            <stop offset="100%" stopColor="#f09819" />
          </linearGradient>
        </svg>

      </div>
    )
  }
}

export default connect(null, actions)(withCookies(withRouter(Login)));
