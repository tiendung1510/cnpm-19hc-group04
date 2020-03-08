import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import './Login.style.scss';

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

export default class Login extends Component {

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <div className="container">
        <div className="login animated bounceInDown">
          <div className="__header">
            <img className="__company-logo" src={require('../../../assets/images/app-logo.png')} alt="logo" />
            <div className="__company-brand">
              <div className="__name"><span>Mini Mart</span></div>
              <div className="__slogan"><span>Tiện Lợi mà Chất Lượng</span></div>
            </div>
          </div>
          <Row className="__content">
            <Col span={10}>
              <div className="__staff-symbol">
                <img src={require('../../../assets/images/staffs.png')} alt="staffs" />
              </div>
            </Col>
            <Col span={14}>
              <p className="__main-title">HỆ THỐNG QUẢN LÝ</p>
              <Form
                className="__form"
                {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
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
                  <Input placeholder="Tài khoản" autoFocus={true} />
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
                  <Input.Password placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit" className="__btn-submit">
                    ĐĂNG NHẬP
              </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>

          <p className="__footer">Mini Mart &copy;2020 All right reserved.</p>
        </div>
      </div>
    )
  }
}
