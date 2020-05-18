import React, { Component } from 'react';
import { Row, Col } from 'antd';
import NumberFormat from 'react-number-format';
import './ProductQuantityStatistic.style.scss';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import SellingHistory from '../SellingHistory/SellingHistory';
import NewProductList from '../NewProductList/NewProductList';

export default class ProductQuantityStatistic extends Component {
  render() {
    const {
      soldQuantityTotal,
      newProductTotal,
      availableQuantityTotal,
      soldQuantityStatisticData,
      sellingHistories,
      newProducts
    } = this.props;

    const chartOptions = {
      legend: { display: false },
      scales: {
        xAxes: [{
          ticks: {
            display: false //this will remove only the label
          },
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            display: false //this will remove only the label
          },
          gridLines: {
            display: false
          }
        }]
      }
    };
    const soldQuantityStatisticChartData = {
      labels: soldQuantityStatisticData.map(item => moment(item.date).format('DD/MM')),
      datasets: [
        {
          label: 'SL',
          fill: false,
          lineTension: 0.2,
          backgroundColor: 'orange',
          borderColor: 'orange',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'orange',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'orange',
          pointHoverBorderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 10,
          data: soldQuantityStatisticData.map(item => item.quantity)
        }
      ]
    }

    return (
      <div className="product-quantity-statistic">
        <Row style={{ width: '100%' }} gutter={[20, 10]} justify="space-between">
          <Col span={8} xs={24} md={8}>
            <div className="product-quantity-statistic__item --sold">
              <SellingHistory
                sellingHistories={[...sellingHistories]}
              />
              <div className="product-quantity-statistic__item__metric">
                <NumberFormat
                  value={soldQuantityTotal}
                  displayType="text"
                  thousandSeparator={true}
                  className="product-quantity-statistic__item__metric__quantity"
                />
                <span className="product-quantity-statistic__item__metric__label">Sản phẩm đã bán</span>
              </div>

              <div className="product-quantity-statistic__item__chart">
                <Line
                  data={soldQuantityStatisticChartData}
                  options={chartOptions}
                  height={180}
                />
              </div>
            </div>
          </Col>
          <Col span={8} xs={24} md={8}>
            <div className="product-quantity-statistic__item --new">
              <NewProductList
                newProducts={[...newProducts]}
              />
              <div className="product-quantity-statistic__item__metric">
                <NumberFormat
                  value={newProductTotal}
                  displayType="text"
                  thousandSeparator={true}
                  prefix={newProductTotal > 0 ? '+' : ''}
                  className="product-quantity-statistic__item__metric__quantity"
                />
                <span className="product-quantity-statistic__item__metric__label">Sản phẩm mới</span>
              </div>
            </div>
          </Col>
          <Col span={8} xs={24} md={8}>
            <div className="product-quantity-statistic__item --available">
              <div className="product-quantity-statistic__item__metric">
                <NumberFormat
                  value={availableQuantityTotal}
                  displayType="text"
                  thousandSeparator={true}
                  className="product-quantity-statistic__item__metric__quantity"
                />
                <span className="product-quantity-statistic__item__metric__label">Sản phẩm tồn kho</span>
              </div>
            </div>
          </Col>
        </Row>
      </div >
    )
  }
}
