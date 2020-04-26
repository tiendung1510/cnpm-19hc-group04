import React, { Component } from 'react';
import './RevenueStatistic.style.scss';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { Bar } from 'react-chartjs-2';
import { Row, Col, Button, Popover, Table, Tooltip } from 'antd';
import { ScheduleFilled, StarFilled, TagFilled, UnorderedListOutlined } from '@ant-design/icons';

export default class RevenueStatistic extends Component {
  render() {
    const {
      statisticData,
      revenueTotal,
      paymentTotal,
      salaryTotal,
      importingCostTotal
    } = this.props;
    const profitTotal = revenueTotal - paymentTotal;
    const height = 55;
    const chartOptions = {
      legend: { display: false },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      }
    };
    const lineChartData = (canvas) => {
      const ctx = canvas.getContext("2d")
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'orange');
      gradient.addColorStop(1, '#ff5858');
      return {
        labels: statisticData.map(item => moment(item.date).format('DD/MM')),
        datasets: [
          {
            label: 'Doanh thu bán hàng',
            fill: true,
            lineTension: 0.3,
            backgroundColor: gradient,
            borderColor: '#ff8220',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ff8220',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#ff8220',
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            data: statisticData.map(item => item.revenue)
          }
        ]
      }
    };

    let paymentItems = [
      {
        key: 1,
        name: 'Lương nhân viên',
        value: salaryTotal
      }
    ];

    if (importingCostTotal > 0) {
      paymentItems.push({
        key: paymentItems.length + 1,
        name: 'Chi phí nhập hàng',
        value: importingCostTotal
      });
    }
    const paymentItemColumns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: 100
      },
      {
        title: 'Hạng mục',
        dataIndex: 'name',
        key: 'name',
        width: 300
      },
      {
        title: 'Chi phí',
        dataIndex: 'value',
        key: 'value',
        width: 200,
        render: value => (
          <NumberFormat
            value={value}
            displayType="text"
            thousandSeparator={true}
            suffix=" đ̲"
          />
        )
      }
    ];

    return (
      <div className="reporting__revenue-statistic reporting__block-style">
        <Row style={{ width: '100%', position: 'relative', margin: 0 }} gutter={20} justify="center">
          <Col span={8}>
            <div className="reporting__revenue-statistic__widget --revenue-total">
              <div className="reporting__revenue-statistic__widget__content">
                <div className="reporting__revenue-statistic__widget__content__value">
                  <StarFilled />
                  <NumberFormat
                    value={revenueTotal}
                    displayType="text"
                    thousandSeparator={true}
                    suffix=" đ̲"
                    className="reporting__revenue-statistic__revenue__number"
                  />
                </div>
                <span className="reporting__revenue-statistic__widget__content__label">Tổng doanh thu bán hàng</span>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="reporting__revenue-statistic__widget --payment-total">
              <Popover
                content={
                  <Table
                    dataSource={paymentItems}
                    columns={paymentItemColumns}
                    pagination={false}
                  />
                }
                title="Hạng mục cần chi trả"
                trigger="click"
                placement="bottom"
                overlayClassName="reporting__revenue-statistic__widget__popover"
              >
                <Tooltip title="Hạng mục cần chi trả" placement="top">
                  <Button
                    shape="circle"
                    icon={<UnorderedListOutlined />}
                    className="reporting__revenue-statistic__widget__btn"
                  />
                </Tooltip>
              </Popover>
              <div className="reporting__revenue-statistic__widget__content">
                <div className="reporting__revenue-statistic__widget__content__value">
                  <TagFilled />
                  <NumberFormat
                    value={paymentTotal}
                    displayType="text"
                    thousandSeparator={true}
                    suffix=" đ̲"
                    className="reporting__revenue-statistic__revenue__number"
                  />
                </div>
                <span className="reporting__revenue-statistic__widget__content__label">Tổng phí đã chi trả</span>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="reporting__revenue-statistic__widget --profit-total">
              <div className="reporting__revenue-statistic__widget__content">
                <div className="reporting__revenue-statistic__widget__content__value">
                  <ScheduleFilled />
                  <NumberFormat
                    value={profitTotal}
                    displayType="text"
                    thousandSeparator={true}
                    suffix=" đ̲"
                    className="reporting__revenue-statistic__revenue__number"
                  />
                </div>
                <span className="reporting__revenue-statistic__widget__content__label">Tổng doanh thu sau chi trả</span>
              </div>
            </div>
          </Col>
        </Row>
        <div className="reporting__revenue-statistic__chart">
          <h1>Doanh thu bán hàng mỗi ngày</h1>
          <Bar
            data={lineChartData}
            options={chartOptions}
            height={height}
          />
        </div>
      </div>
    )
  }
}
