import React, { Component } from 'react';
import { Avatar, Row, Col } from 'antd';
import './PendingRequest.style.scss';
import moment from 'moment';

export default class PendingRequest extends Component {
  render() {
    const { details } = this.props;
    return (
      <div className="importing-request__container__block__body__request--pending">
        <div className="importing-request__container__block__body__request--pending__summary animated fadeIn">
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
                  Gửi lúc {moment(details.createdAt).format('HH:mm DD-MM-YYYY')}
                </span>
                <p className="importing-request__container__block__body__request--pending__summary__details__products">
                  {details.requiredProducts.map(rp => rp.product.name).join(', ')}.
                  </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
