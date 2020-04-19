import React, { Component } from 'react';
import './RevenueStatistic.style.scss';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { Line } from 'react-chartjs-2';
import { Row, Col } from 'antd';
import { DollarCircleOutlined, MinusCircleOutlined, CoffeeOutlined } from '@ant-design/icons';

export default class RevenueStatistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const { month, year } = this.props;
    this.loadData(month, year);
  }

  componentWillReceiveProps(props) {
    const { month, year } = props;
    this.loadData(month, year);
  }

  loadData(month, year) {
    let data = [];
    const daysInMonth = moment(`${month}/${year}`, 'MM/YYYY').daysInMonth();
    for (let day = 1; day <= daysInMonth; day++)
      data.push({
        date: moment(`${day}/${month}/${year}`, 'DD/MM/YYYY'),
        revenue: Math.random(),
        payment: Math.random()
      });
    this.setState({ data });
  }

  render() {
    const { data } = this.state;
    const revenueTotal = data.reduce((acc, cur) => acc + cur.revenue, 0);
    const paymentTotal = data.reduce((acc, cur) => acc + cur.payment, 0);
    const profitTotal = revenueTotal - paymentTotal;
    const height = 55;
    const lineChartData = (canvas) => {
      const ctx = canvas.getContext("2d")
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'orange');
      gradient.addColorStop(1, 'rgba(255, 165, 0, 0.02)');
      const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
      gradient2.addColorStop(0, '#dcdcdc');
      gradient2.addColorStop(1, 'rgba(220, 220, 220, 0.02)');
      return {
        labels: data.map(item => item.date.format('DD/MM')),
        datasets: [
          {
            label: 'Doanh thu',
            fill: false,
            lineTension: 0,
            backgroundColor: gradient,
            borderColor: 'orange',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'orange',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'orange',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data.map(item => item.revenue)
          },
          {
            label: 'Phí chi trả',
            fill: false,
            lineTension: 0,
            backgroundColor: gradient2,
            borderColor: '#dcdcdc',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#dcdcdc',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#dcdcdc',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data.map(item => item.payment)
          }
        ]
      }
    };

    return (
      <div className="reporting__revenue-statistic reporting__block-style">
        <Row style={{ width: '100%', position: 'relative' }} gutter={20}>
          <Col span={8}>
            <div className="reporting__revenue-statistic__widget --revenue-total">
              <div className="reporting__revenue-statistic__widget__content">
                <div className="reporting__revenue-statistic__widget__content__value">
                  <DollarCircleOutlined />
                  <NumberFormat
                    value={revenueTotal}
                    displayType="text"
                    thousandSeparator={true}
                    suffix=" VNĐ"
                    className="reporting__revenue-statistic__revenue__number"
                  />
                </div>
                <span className="reporting__revenue-statistic__widget__content__label">Tổng doanh thu siêu thị</span>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="reporting__revenue-statistic__widget --payment-total">
              <div className="reporting__revenue-statistic__widget__content">
                <div className="reporting__revenue-statistic__widget__content__value">
                  <MinusCircleOutlined />
                  <NumberFormat
                    value={paymentTotal}
                    displayType="text"
                    thousandSeparator={true}
                    suffix=" VNĐ"
                    className="reporting__revenue-statistic__revenue__number"
                  />
                </div>
                <span className="reporting__revenue-statistic__widget__content__label">Tổng phí chi trả</span>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="reporting__revenue-statistic__widget --profit-total">
              <div className="reporting__revenue-statistic__widget__content">
                <div className="reporting__revenue-statistic__widget__content__value">
                  <CoffeeOutlined />
                  <NumberFormat
                    value={profitTotal}
                    displayType="text"
                    thousandSeparator={true}
                    suffix=" VNĐ"
                    className="reporting__revenue-statistic__revenue__number"
                  />
                </div>
                <span className="reporting__revenue-statistic__widget__content__label">Tổng tiền lãi</span>
              </div>
            </div>
          </Col>
        </Row>
        <div className="reporting__revenue-statistic__chart">
          <Line data={lineChartData} height={height} />
        </div>
      </div>
    )
  }
}
