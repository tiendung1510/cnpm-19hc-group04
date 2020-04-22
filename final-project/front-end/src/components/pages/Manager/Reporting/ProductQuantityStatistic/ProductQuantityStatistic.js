import React, { Component } from 'react';
import { Row, Col } from 'antd';
import NumberFormat from 'react-number-format';
import './ProductQuantityStatistic.style.scss';

export default class ProductQuantityStatistic extends Component {
  render() {
    const { soldQuantityTotal, availableQuantityTotal } = this.props;
    return (
      <div className="product-quantity-statistic">
        <Row style={{ width: '100%' }} gutter={20}>
          <Col span={8}>
            <div className="product-quantity-statistic__item --sold">
              <NumberFormat
                value={soldQuantityTotal}
                displayType="text"
                thousandSeparator={true}
                className="product-quantity-statistic__item__quantity"
              />
              <span className="product-quantity-statistic__item__label">Sản phẩm đã bán</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="product-quantity-statistic__item --new">
              <NumberFormat
                value={availableQuantityTotal}
                displayType="text"
                thousandSeparator={true}
                prefix="+"
                className="product-quantity-statistic__item__quantity"
              />
              <span className="product-quantity-statistic__item__label">Sản phẩm mới</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="product-quantity-statistic__item --available">
              <NumberFormat
                value={availableQuantityTotal}
                displayType="text"
                thousandSeparator={true}
                className="product-quantity-statistic__item__quantity"
              />
              <span className="product-quantity-statistic__item__label">Sản phẩm tồn kho</span>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
