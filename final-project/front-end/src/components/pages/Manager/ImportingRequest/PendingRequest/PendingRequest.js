import React, { Component } from 'react';
import { Avatar, Row, Col, Table, Button, Modal, InputNumber, Divider, Menu, Dropdown, Form, message, Input } from 'antd';
import { RightOutlined, MessageOutlined, DownOutlined } from '@ant-design/icons';
import './PendingRequest.style.scss';
import moment from 'moment';
import IMPORTING_REQUEST_CONSTANT from '../../../../../constants/importing-request.constant';
import NumberFormat from 'react-number-format';
import * as _ from 'lodash';

export default class PendingRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      executor: {},
      requiredProducts: []
    }
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { details } = this.props;
    const requiredProducts = details.requiredProducts.map(item => ({
      _id: item.product._id,
      quantity: 1
    }));
    this.setState({ requiredProducts });
  }

  setDialogVisible(isVisible) {
    this.setState({ isVisible });
  }

  handleSelectExcecutor(data) {
    const executor = JSON.parse(data);
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue({ executor: executor._id });
    }
    this.setState({ executor });
  }

  acceptRequest(values) {
    if (!values.executor) {
      message.error('Thông tin bàn giao chưa đầy đủ, vui lòng kiểm tra lại');
      return;
    }

    const importingRequestID = this.props.details._id;
    const params = {
      ...values,
      requiredProducts: this.state.requiredProducts
    }
    
    console.log(importingRequestID, params);
  }

  onRequiredProductQuantityInputChanged(id, quantity) {
    const { requiredProducts } = this.state;
    const index = _.findIndex(requiredProducts, p => p._id === id);
    requiredProducts[index].quantity = quantity;
    this.setState({ requiredProducts });
  }

  render() {
    const { details, importers } = this.props;
    const { executor } = this.state;
    const requiredProducts = details.requiredProducts.map(item => ({ ...item, key: item._id }));
    const columns = [
      {
        title: 'Sản phẩm',
        dataIndex: 'product',
        key: 'product',
        width: 220,
        render: (value, record) => (
          <div>
            <img src={record.product.image} alt="product" style={{ width: 20, margin: 15 }} />
            <span>{record.product.name}</span>
          </div>
        )
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'supplier',
        key: 'supplier',
        width: 220,
        render: (value, record) => record.product.supplier.name
      },
      {
        title: 'Giá bán',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render: (value, record) => (
          <NumberFormat
            value={record.product.price}
            displayType="text"
            thousandSeparator={true}
            suffix=" VNĐ"
            style={{ fontWeight: 'bold' }}
          />
        )
      },
      {
        title: <center><span style={{ marginLeft: 15 }}>SL yêu cầu</span></center>,
        dataIndex: 'quantity',
        key: 'quantity',
        render: (value, record) => (
          <center>
            <InputNumber
              min={1}
              max={999}
              defaultValue={1}
              onChange={e => this.onRequiredProductQuantityInputChanged(record.product._id, e)}
            />
          </center>
        )
      }
    ];

    const executorMenu = (
      <Menu onClick={e => this.handleSelectExcecutor(e.key)}>
        {importers.map(i => (
          <Menu.Item key={JSON.stringify(i)}>
            <Avatar src={i.avatar} size={20} style={{ marginRight: 10 }} />
            {i.fullname}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div className="importing-request__container__block__body__request--pending">
        <div
          className="importing-request__container__block__body__request--pending__summary animated fadeIn"
          onClick={() => this.setDialogVisible(true)}
        >
          <Row gutter={10} style={{ width: '100%', height: '100%' }}>
            <Col span={4}>
              <Avatar
                className="importing-request__container__block__body__request--pending__summary__avatar"
                src={details.sender.avatar} size={24} />
            </Col>
            <Col span={20}>
              <div className="importing-request__container__block__body__request--pending__summary__details">
                <span className="importing-request__container__block__body__request--pending__summary__details__title">
                  {details.sender.fullname}
                </span>
                <span className="importing-request__container__block__body__request--pending__summary__details__time">
                  Vào lúc {moment(details.createdAt).format('HH:mm DD-MM-YYYY')}
                </span>
                <p className="importing-request__container__block__body__request--pending__summary__details__products">
                  {details.requiredProducts.map(rp => rp.product.name).join(', ')}.
                  </p>
              </div>
            </Col>
          </Row>
        </div>

        <Modal
          className="importing-request__container__block__body__request--pending__dialog"
          title={
            <div style={{ color: '#ff8220', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <MessageOutlined style={{ marginRight: 15, fontSize: 20, color: 'orange' }} />
              <span>Yêu cầu nhập hàng</span>
            </div>
          }
          visible={this.state.isVisible}
          footer={false}
          onCancel={() => this.setDialogVisible(false)}
        >

          <Row style={{ width: '100%' }}>
            <Col span={5}><ul className="importing-request__container__block__body__request--pending__dialog__labels">
              <li>Người gửi</li>
              <li>Vào lúc</li>
              <li>Trạng thái</li>
              <li>Sản phẩm yêu cầu ({requiredProducts.length})</li>
            </ul></Col>
            <Col span={19}>
              <ul className="importing-request__container__block__body__request--pending__dialog__values">
                <li>{details.sender.fullname}</li>
                <li>{moment(details.createdAt).format('HH:mm DD-MM-YYYY')}</li>
                <li>
                  <span className="importing-request__container__block__body__request--pending__dialog__values__status">
                    {IMPORTING_REQUEST_CONSTANT.STATUS.PENDING.name}
                  </span>
                </li>
              </ul>
            </Col>
          </Row>

          <div className="importing-request__container__block__body__request--pending__dialog__products">
            <Table
              dataSource={requiredProducts}
              columns={columns}
              pagination={false}
              scroll={{ y: 250 }}
            />
          </div>

          <div className="importing-request__container__block__body__request--pending__dialog__executor">
            <Row align="middle">
              <Col span={19}>
                <div className="importing-request__container__block__body__request--pending__dialog__executor__title">
                  <span><span style={{ color: 'red' }}>*</span> Bàn giao thực hiện</span>
                </div>
              </Col>
              <Col span={5}>
                <Button
                  shape="round"
                  type="primary"
                  className="importing-request__container__block__body__request--pending__dialog__executor__btn-submit"
                  onClick={() => {
                    if (this.formRef.current) {
                      this.formRef.current.submit();
                    }
                  }}
                >
                  <span>Bàn giao</span>
                  <RightOutlined />
                </Button>
              </Col>
            </Row>
            <Divider />

            <Form
              ref={current => this.formRef.current = current}
              onFinish={values => this.acceptRequest(values)}
            >
              <Row style={{ width: '100%' }}>
                <Col span={5}><ul className="importing-request__container__block__body__request--pending__dialog__labels">
                  <li>Người thực hiện</li>
                  <li>Ghi chú</li>
                </ul></Col>
                <Col span={19}>
                  <ul className="importing-request__container__block__body__request--pending__dialog__values">
                    <li>
                      <Form.Item name="executor" >
                        <Dropdown overlay={executorMenu}>
                          <Button>
                            <Row style={{ width: 200 }} align="middle">
                              <Col span={22} align="left">{executor.fullname || 'Chọn nhân viên...'}</Col>
                              <Col span={2}><DownOutlined /></Col>
                            </Row>
                          </Button>
                        </Dropdown>
                      </Form.Item>
                    </li>
                    <li><Form.Item name="note">
                      <Input.TextArea placeholder="Nhập ghi chú..." />
                    </Form.Item></li>
                  </ul>
                </Col>
              </Row>

            </Form>

          </div>

        </Modal>

      </div>
    )
  }
}
