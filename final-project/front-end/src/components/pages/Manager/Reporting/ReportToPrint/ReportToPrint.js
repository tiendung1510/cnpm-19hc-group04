import React, { Component } from 'react';
import './ReportToPrint.style.scss';
import moment from 'moment';
import { Table, Row, Col } from 'antd';
import { withCookies } from 'react-cookie';
import { COOKIE_NAMES } from '../../../../../constants/cookie-name.constant';
import NumberFormat from 'react-number-format';

class ReportToPrint extends Component {
  render() {
    const manager = this.props.cookies.get(COOKIE_NAMES.user);
    let {
      soldProducts,
      importedProducts,
      sellingRevenueTotal,
      salaryTotal,
      importingCostTotal,
      month,
      year
    } = this.props;

    soldProducts = soldProducts.map((p, i) => {
      const newProduct = { ...p, key: i, sellingRevenue: p.quantity * p.details.price };
      newProduct.details._id = newProduct.details._id.slice(-12);
      return newProduct;
    });
    soldProducts.push({
      key: soldProducts.length,
      quantity: soldProducts.reduce((acc, cur) => acc + cur.quantity, 0),
      details: {
        _id: 'Tổng cộng',
        name: '',
        availableQuantity: soldProducts.reduce((acc, cur) => acc + cur.details.availableQuantity, 0),
        price: ''
      },
      sellingRevenue: soldProducts.reduce((acc, cur) => acc + cur.sellingRevenue, 0)
    });
    const soldProductColumns = [
      {
        title: 'Mã sản phẩm',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (value, record) => record.details._id
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (value, record) => record.details.name
      },
      {
        title: <center>SL tồn kho</center>,
        dataIndex: 'availableQuantity',
        key: 'availableQuantity',
        width: 100,
        render: (value, record) => <center>{record.details.availableQuantity}</center>
      },
      {
        title: <center>SL đã bán</center>,
        dataIndex: 'quantity',
        key: 'quantity',
        width: 100,
        render: value => <center>{value}</center>
      },
      {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render: (value, record) => (
          <NumberFormat
            value={record.details.price}
            displayType="text"
            thousandSeparator={true}
            suffix=" đ̲"
          />
        )
      },
      {
        title: 'Doanh thu',
        dataIndex: 'sellingRevenue',
        key: 'sellingRevenue',
        width: 100,
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

    importedProducts = importedProducts.map((p, i) => {
      const newProduct = { ...p, key: i, importingCost: p.importedQuantity * p.details.price };
      newProduct.details._id = newProduct.details._id.slice(-12);
      return newProduct;
    });
    importedProducts.push({
      key: importedProducts.length,
      importedQuantity: importedProducts.reduce((acc, cur) => acc + cur.importedQuantity, 0),
      requiredQuantity: importedProducts.reduce((acc, cur) => acc + cur.requiredQuantity, 0),
      details: {
        _id: 'Tổng cộng',
        name: '',
        availableQuantity: importedProducts.reduce((acc, cur) => acc + cur.details.availableQuantity, 0)
      },
      importingCost: importedProducts.reduce((acc, cur) => acc + cur.importingCost, 0)
    })
    const importedProductColumns = [
      {
        title: 'Mã sản phẩm',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (value, record) => record.details._id
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (value, record) => record.details.name
      },
      {
        title: <center>SL tồn kho</center>,
        dataIndex: 'availableQuantity',
        width: 100,
        key: 'availableQuantity',
        render: (value, record) => <center>{record.details.availableQuantity}</center>
      },
      {
        title: <center>SL đã nhập</center>,
        dataIndex: 'importedQuantity',
        width: 100,
        key: 'importedQuantity',
        render: value => <center>{value}</center>
      },
      {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render: (value, record) => (
          <NumberFormat
            value={record.details.price}
            displayType="text"
            thousandSeparator={true}
            suffix=" đ̲"
          />
        )
      },
      {
        title: 'Phí nhập',
        dataIndex: 'importingCost',
        key: 'importingCost',
        width: 100,
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

    const incomes = [
      {
        key: '1',
        order: 1,
        name: 'Doanh thu bán hàng',
        value: sellingRevenueTotal
      },
      {
        key: '2',
        order: 'Tổng doanh thu',
        name: '',
        value: sellingRevenueTotal
      }
    ];
    const incomeColumns = [
      {
        title: 'STT',
        dataIndex: 'order',
        key: 'order',
        width: 125
      },
      {
        title: 'Hạng mục',
        dataIndex: 'name',
        key: 'name',
        width: 250
      },
      {
        title: 'Doanh thu',
        dataIndex: 'value',
        key: 'value',
        width: 125,
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

    const payments = [
      {
        key: '1',
        order: 1,
        name: 'Lương nhân sự',
        value: salaryTotal
      },
      {
        key: '2',
        order: 2,
        name: 'Chi phí nhập hàng',
        value: importingCostTotal
      },
      {
        key: '3',
        order: 'Tổng chi trả',
        name: '',
        value: salaryTotal + importingCostTotal
      }
    ];
    const paymentColumns = [
      {
        title: 'STT',
        dataIndex: 'order',
        key: 'order',
        width: 125
      },
      {
        title: 'Hạng mục',
        dataIndex: 'name',
        key: 'name',
        width: 250
      },
      {
        title: 'Chi phí',
        dataIndex: 'value',
        key: 'value',
        width: 125,
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
      <div className="reporting__report-to-print__content">
        <div className="reporting__report-to-print__content__header">
          <div className="reporting__report-to-print__content__header__company">
            <img
              className="reporting__report-to-print__content__header__company__logo"
              src={require('../../../../../assets/images/app-logo.png')} alt="logo" />
            <div className="reporting__report-to-print__content__header__company__brand">
              <div className="reporting__report-to-print__content__header__company__brand__name">
                <span>Mini Mart</span>
              </div>
              <div className="reporting__report-to-print__content__header__company__brand__slogan">
                <span>Tiện Lợi mà Chất Lượng</span>
              </div>
            </div>
          </div>
          <span className="reporting__report-to-print__content__header__date">Ngày xuất: {moment().format('DD/MM/YYYY HH:mm')}</span>
        </div>
        <h2 className="reporting__report-to-print__content__main-title">
          BÁO CÁO THÁNG {moment(`${month}/${year}`, 'MM/YYYY').format('MM/YYYY')}
        </h2>
        <div className="reporting__report-to-print__content__body">

          <div className="reporting__report-to-print__content__body__selling-statistic">
            <h3>1. Bán hàng</h3>
            <div className="reporting__report-to-print__content__body__table">
              <Table
                dataSource={[...soldProducts]}
                columns={soldProductColumns}
                pagination={false}
              />
            </div>
          </div>

          <div className="reporting__report-to-print__content__body__importing-statistic">
            <h3>2. Nhập hàng</h3>
            <div className="reporting__report-to-print__content__body__table">
              <Table
                dataSource={[...importedProducts]}
                columns={importedProductColumns}
                pagination={false}
              />
            </div>
          </div>

          <div className="reporting__report-to-print__content__body__revenue-statistic">
            <h3>3. Doanh thu</h3>
            <div className="reporting__report-to-print__content__body__table">
              <Table
                dataSource={[...incomes]}
                columns={incomeColumns}
                pagination={false}
              />
            </div>
          </div>

          <div className="reporting__report-to-print__content__body__revenue-statistic">
            <h3>4. Chi trả</h3>
            <div className="reporting__report-to-print__content__body__table">
              <Table
                dataSource={[...payments]}
                columns={paymentColumns}
                pagination={false}
              />
            </div>
          </div>

          <Row justify="center" align="middle"
            className="reporting__report-to-print__content__body__manager-confirm">
            <Col span={14}></Col>
            <Col span={10} align="middle">
              <span className="reporting__report-to-print__content__body__manager-confirm__stand-for">TM. Người quản lý</span>
              <div className="reporting__report-to-print__content__body__manager-confirm__signature">
                <img src="https://files.slack.com/files-pri/THXMMTH2T-F0110T0NABG/signature__1_.png" alt="signature" />
              </div>
              <span className="reporting__report-to-print__content__body__manager-confirm__fullname">{manager.fullname}</span>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}
export default withCookies(ReportToPrint);