import React, { Component } from 'react';
import './SellingHistory.style.scss';
import { Popover, Button, Tooltip, Empty, Row, Col } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';
import NumberFormat from 'react-number-format';

export default class SellingHistory extends Component {
  render() {
    let { sellingHistories } = this.props;
    sellingHistories = sellingHistories.map((h, i) => ({ ...h, key: i }));
    return (
      <div className="selling-history">
        <Popover
          placement="right"
          title="Lịch sử bán hàng"
          content={
            <div className="selling-history__content__list">
              {sellingHistories.length === 0 ? (
                <div className="selling-history__content__list__empty">
                  <Empty description="Chưa có ghi nhận nào" />
                </div>
              ) : (
                  sellingHistories.map((sh, i) => (
                    <div className="selling-history__content__list__item" key={i}>
                      <p className="selling-history__content__list__item__products">
                        {sh.soldItems.map((item, index) => {
                          return index < sh.soldItems.length - 1 ? (
                            <span key={index}>{`${item.product.name} x${item.quantity}, `}</span>
                          ) : (
                              <span key={index}>{`${item.product.name} x${item.quantity}.`}</span>
                            )
                        })}
                      </p>
                      <div className="selling-history__content__list__item__footer">
                        <Row style={{ width: '100%' }} gutter={10}>
                          <Col span={8}>
                            <span className="selling-history__content__list__item__footer__label">
                              Vào lúc:
                            </span>
                            <span className="selling-history__content__list__item__footer__value">
                              {moment(sh.submittedAt).format('HH:mm DD/MM/YYYY')}
                            </span>
                          </Col>
                          <Col span={8}>
                            <span className="selling-history__content__list__item__footer__label">
                              Thu ngân:
                            </span>
                            <span className="selling-history__content__list__item__footer__value --highline">
                              {sh.cashier.fullname}
                            </span>
                          </Col>
                          <Col span={8}>
                            <span className="selling-history__content__list__item__footer__label">
                              Tổng tiền:
                            </span>
                            <NumberFormat
                              className="selling-history__content__list__item__footer__value"
                              value={Number(sh.priceTotal)}
                              displayType="text"
                              thousandSeparator={true}
                              suffix=" đ̲"
                              style={{ fontWeight: 'bold' }}
                            />
                          </Col>
                        </Row>

                      </div>
                    </div>
                  ))
                )}
            </div>
          }
          trigger="click"
          overlayClassName="selling-history__content"
        >
          <Tooltip title="Lịch sử bán hàng" placement="top">
            <Button
              icon={<HistoryOutlined />}
              shape="circle"
              className="product-quantity-statistic__item__btn"
            />
          </Tooltip>
        </Popover>
      </div>
    )
  }
}
