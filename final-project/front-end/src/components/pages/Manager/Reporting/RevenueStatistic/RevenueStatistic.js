import React, { Component } from 'react';
import './RevenueStatistic.style.scss';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { Line } from 'react-chartjs-2';

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
    const lineChartData = {
      labels: data.map(item => item.date.format('DD/MM')),
      datasets: [
        {
          label: 'Doanh thu',
          fill: false,
          lineTension: 0,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: '#ff8220',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#ff8220',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff8220',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data.map(item => item.revenue)
        },
        {
          label: 'Chi trả',
          fill: false,
          lineTension: 0,
          backgroundColor: 'rgba(75,192,192,0.4)',
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
    };

    return (
      <div className="reporting__revenue-statistic reporting__block-style">
        <h1>Thống kê doanh số</h1>
        <ul className="reporting__revenue-statistic__revenue">
          <li>
            <span className="reporting__revenue-statistic__revenue__label">Tổng doanh thu:</span>
            <NumberFormat
              value={data.reduce((acc, cur) => acc + cur.revenue, 0)}
              displayType="text"
              thousandSeparator={true}
              suffix=" VNĐ"
              className="reporting__revenue-statistic__revenue__number"
            />
          </li>
          <li>
            <span className="reporting__revenue-statistic__revenue__label">Tổng chi trả:</span>
            <NumberFormat
              value={data.reduce((acc, cur) => acc + cur.payment, 0)}
              displayType="text"
              thousandSeparator={true}
              suffix=" VNĐ"
              className="reporting__revenue-statistic__revenue__number"
            />
          </li>
        </ul>
        <div className="reporting__revenue-statistic__chart">
          <Line data={lineChartData} height={70} />
        </div>
      </div>
    )
  }
}
