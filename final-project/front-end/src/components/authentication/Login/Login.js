import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Tooltip } from 'antd';
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
        <div className="dark-bg"></div>
        <div className="login animated fadeIn">
          <div className="__header">
            <img className="__company-logo" src={require('../../../assets/images/app-logo.png')} alt="logo" />
            <div className="__company-brand">
              <div className="__name"><span>Mini Mart</span></div>
              <div className="__slogan"><span>Tiện Lợi mà Chất Lượng</span></div>
            </div>
          </div>
          <Row className="__content">
            <Col span={11}>
              <div className="__staff-symbol">
                <img src={require('../../../assets/images/staffs.png')} alt="staffs" />
              </div>
            </Col>
            <Col span={13}>
              <p className="__main-title">QUẢN LÝ SIÊU THỊ</p>
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

                <div className="__forgot-password">
                  <Tooltip title="Yêu cầu khôi phục mật khẩu">
                    <a style={{ marginLeft: 8 }}>
                      Quên mật khẩu?
                    </a>
                  </Tooltip>
                </div>

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

        <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ff8220" fillOpacity={1} d="M0,160L1440,0L1440,320L0,320Z" /></svg>

      </div>
    )
  }
}
