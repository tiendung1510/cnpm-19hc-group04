import React from 'react';
import { Avatar, Row, Col, Modal, Table, Button, message } from 'antd';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './PendingRequest.style.scss';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import IMPORTING_REQUEST from '../../../../../constants/importing-request.constant';
import { connect } from 'react-redux';
import * as actions from '../../../../../redux/actions';
import { API } from '../../../../../constants/api.constant';
import { COOKIE_NAMES } from '../../../../../constants/cookie-name.constant';
import PageBase from '../../../../utilities/PageBase/PageBase';
import { withCookies } from 'react-cookie';

class PendingRequest extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }

  setDialogVisible(isVisible) {
    this.setState({ isVisible });
  }

  openCancelRequestConfirmDialog() {
    const that = this;
    Modal.confirm({
      title: `Từ chối yêu cầu từ ${this.props.details.sender.fullname}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Không, cảm ơn',
      async onOk() {
        that.props.setAppLoading(true);
        const res = await (
          await fetch(
            API.Manager.ImportingRequestManagement.cancelImportingRequest.replace('{importingRequestID}', that.props.details._id),
            {
              method: 'DELETE',
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'token': that.props.cookies.get(COOKIE_NAMES.token)
              },
              signal: that.abortController.signal
            }
          )
        ).json();
        that.props.setAppLoading(false);
        if (res.status !== 200) {
          message.error(res.errors[0]);
          return;
        }

        that.props.onUpdateImportingRequests(res.data.importingRequests);
        that.setDialogVisible(false);
        message.success(res.messages[0]);
      }
    });
  }

  render() {
    const { details } = this.props;
    const columns = [
      {
        title: 'Sản phẩm',
        dataIndex: 'product',
        key: 'product',
        width: 200,
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
        width: 200,
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
            suffix=" đ̲"
            style={{ fontWeight: 'bold' }}
          />
        )
      }
    ];

    return (
      <div className="pending-importing-request">
        <div className="pending-importing-request__summary animated fadeIn">
          <Row
            gutter={10}
            style={{ width: '100%', height: '100%' }}
            onClick={() => this.setDialogVisible(true)}
          >
            <Col span={4}>
              <Avatar
                className="pending-importing-request__summary__avatar"
                src={details.sender.avatar} size={24} />
            </Col>
            <Col span={20}>
              <div className="pending-importing-request__summary__details">
                <span className="pending-importing-request__summary__details__title">
                  {details.sender.fullname}
                </span>
                <span className="pending-importing-request__summary__details__time">
                  Yêu cầu lúc {moment(details.createdAt).format('HH:mm DD-MM-YYYY')}
                </span>
                <p className="pending-importing-request__summary__details__products">
                  {details.requiredProducts.map(rp => rp.product.name).join(', ')}.
                </p>
              </div>
            </Col>
          </Row>

          <CloseOutlined
            className="pending-importing-request__summary__btn-cancel"
            onClick={() => this.openCancelRequestConfirmDialog()}
          />
        </div>

        <Modal
          className="pending-importing-request__content"
          title={<span style={{ color: '#ff8220', fontWeight: 'bold' }}>Thông tin yêu cầu</span>}
          visible={this.state.isVisible}
          footer={null}
          onCancel={() => this.setDialogVisible(false)}
        >
          <Row style={{ width: '100%' }}>
            <Col span={7}>
              <ul className="pending-importing-request__content__labels">
                <li>Người yêu cầu</li>
                <li>Vào lúc</li>
                <li>Trạng thái</li>
                <li>Sản phẩm yêu cầu ({details.requiredProducts.length})</li>
              </ul>
            </Col>
            <Col span={17}>
              <ul className="pending-importing-request__content__values">
                <li><strong>{details.sender.fullname}</strong></li>
                <li>{moment(details.createdAt).format('HH:mm DD-MM-YYYY')}</li>
                <li><span className="pending-importing-request__content__values__status">{IMPORTING_REQUEST.STATUS.PENDING.name}</span></li>
              </ul>
            </Col>
          </Row>

          <div className="pending-importing-request__content__products">
            <Table
              dataSource={[...details.requiredProducts]}
              columns={columns}
              pagination={false}
              scroll={{ y: 250 }}
            />
          </div>

          <div className="pending-importing-request__content__btn-cancel-wrapper">
            <Button
              className="pending-importing-request__content__btn-cancel-wrapper__btn"
              onClick={() => this.openCancelRequestConfirmDialog()}
              type="primary"
              shape="round"
            >
              Từ chối yêu cầu
            </Button>
          </div>

        </Modal>
      </div>
    )
  }
}
export default connect(null, actions)(withCookies(PendingRequest));