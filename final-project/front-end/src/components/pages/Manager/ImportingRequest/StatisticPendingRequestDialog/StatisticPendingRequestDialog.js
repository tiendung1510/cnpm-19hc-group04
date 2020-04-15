import React from 'react';
import { Button, Modal, Table, InputNumber, Divider, Dropdown, Menu, Avatar, Form, Input, Row, Col, message } from 'antd';
import NumberFormat from 'react-number-format';
import { DownOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './StatisticPendingRequestDialog.style.scss';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../../../../redux/actions';
import { withCookies } from 'react-cookie';
import { COOKIE_NAMES } from '../../../../../constants/cookie-name.constant';
import { API } from '../../../../../constants/api.constant';
import PageBase from '../../../../utilities/PageBase/PageBase';

class StatisticPendingRequestDialog extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      requiredProducts: [],
      executor: {},
      priceTotal: 0
    }
    this.formRef = React.createRef();
  }

  componentWillReceiveProps(props) {
    const { pendingRequests } = props;
    let requiredProducts = [];
    for (const r of pendingRequests) {
      for (const p of r.requiredProducts)
        requiredProducts.push(p);
    }
    requiredProducts = requiredProducts.map((p, i) => ({ ...p, key: i }));
    requiredProducts = _.uniqBy(requiredProducts, p => p.product._id);
    this.setState({
      requiredProducts,
      priceTotal: requiredProducts.reduce((acc, cur) => acc + cur.product.price, 0)
    });
  }

  setDialogVisible(isVisible) {
    this.setState({ isVisible });
  }

  onRequiredProductQuantityInputChanged(id, quantity) {
    const { requiredProducts } = this.state;
    const index = _.findIndex(requiredProducts, p => p._id === id);
    requiredProducts[index].requiredQuantity = quantity;
    this.setState({
      requiredProducts,
      priceTotal: requiredProducts.reduce((acc, cur) => acc + (cur.requiredQuantity * cur.product.price), 0)
    });
  }

  async acceptRequests(values) {
    if (!values.executor) {
      message.error('Thông tin bàn giao chưa đầy đủ, vui lòng kiểm tra lại');
      return;
    }

    this.props.setAppLoading(true);
    const { requiredProducts, priceTotal } = this.state;
    let { pendingRequests } = this.props;
    const params = {
      ...values,
      priceTotal,
      requests: pendingRequests.map(r => ({ _id: r._id })),
      importedProducts: requiredProducts.map(rp => ({
        productID: rp.product._id,
        requiredQuantity: rp.requiredQuantity
      }))
    }
    const res = await (
      await fetch(
        API.Manager.ImportingRequestManagement.acceptImportingRequests,
        {
          method: 'PUT',
          body: JSON.stringify(params),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'token': this.props.cookies.get(COOKIE_NAMES.token)
          },
          signal: this.abortController.signal
        }
      )
    ).json();

    this.props.setAppLoading(false);
    if (res.status !== 200) {
      message.error(res.errors[0]);
      return;
    }

    this.props.onAcceptRequests();
    this.setDialogVisible(false);
  }

  handleSelectExcecutor(data) {
    const executor = JSON.parse(data);
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue({ executor: executor._id });
    }
    this.setState({ executor });
  }

  render() {
    const { importers } = this.props;
    const { requiredProducts, executor, priceTotal } = this.state;
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
              onChange={e => this.onRequiredProductQuantityInputChanged(record._id, e)}
            />
          </center>
        )
      }
    ];

    const executorMenu = (
      <Menu onClick={e => this.handleSelectExcecutor(e.key)}>
        {importers.map(i => (
          <Menu.Item key={JSON.stringify(i)}>
            <Avatar
              src={i.avatar}
              size={20}
              style={{ marginRight: 10 }}
            />
            {i.fullname}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div className="statistic-pending-request-dialog">
        <div className="statistic-pending-request-dialog__btn-open-wrapper">
          <Button
            shape="round"
            className="statistic-pending-request-dialog__btn-open-wrapper__btn"
            onClick={() => this.setDialogVisible(true)}
            disabled={requiredProducts.length === 0}
          >
            Thống kê sản phẩm yêu cầu
          </Button>
        </div>

        <Modal
          className="statistic-pending-request-dialog__content"
          title={
            <span style={{ color: '#ff8220', fontWeight: 'bold' }}>
              Sản phẩm yêu cầu ({requiredProducts.length})
            </span>
          }
          visible={this.state.isVisible}
          footer={null}
          onCancel={() => this.setDialogVisible(false)}
        >
          <div className="statistic-pending-request-dialog__content__products">
            <Table
              dataSource={requiredProducts}
              columns={columns}
              pagination={false}
              scroll={{ y: 250 }}
            />
          </div>

          <Row
            align="middle"
            className="statistic-pending-request-dialog__content__price-total"

          >
            <Col span={19}>Tổng tiền</Col>
            <Col span={5} align="center">
              <NumberFormat
                value={priceTotal}
                displayType="text"
                thousandSeparator={true}
                suffix=" VNĐ"
                style={{ fontWeight: 'bold' }}
              />
            </Col>
          </Row>

          <div className="statistic-pending-request-dialog__content__executor">
            <Row align="middle">
              <Col span={19}>
                <div className="statistic-pending-request-dialog__content__executor__title">
                  <span>Bàn giao thực hiện</span>
                </div>
              </Col>
              <Col span={5}>
                <Button
                  shape="round"
                  type="primary"
                  className="statistic-pending-request-dialog__content__executor__btn-submit"
                  onClick={() => {
                    if (this.formRef.current) {
                      this.formRef.current.submit();
                    }
                  }}
                >
                  <span>Bàn giao</span>
                  <ArrowRightOutlined />
                </Button>
              </Col>
            </Row>

            <Divider />

            <Form
              ref={current => this.formRef.current = current}
              onFinish={values => this.acceptRequests(values)}
            >
              <Row style={{ width: '100%' }}>
                <Col span={5}><ul className="statistic-pending-request-dialog__content__labels">
                  <li>Người thực hiện</li>
                  <li>Ghi chú</li>
                </ul></Col>
                <Col span={19}>
                  <ul className="statistic-pending-request-dialog__content__values">
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
export default connect(null, actions)(withCookies(StatisticPendingRequestDialog));