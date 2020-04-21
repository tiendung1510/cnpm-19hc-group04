import React from 'react';
import { DatePicker, Row, Col, Table, Input, Progress } from 'antd';
import './Reporting.style.scss';
import PageBase from '../../../utilities/PageBase/PageBase';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/actions';
import { withCookies } from 'react-cookie';
import { API } from '../../../../constants/api.constant';
import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import moment from 'moment';
import RevenueStatistic from './RevenueStatistic/RevenueStatistic';
import MONTHS from '../../../../constants/months.constant';
import QRCode from 'qrcode.react';
import NumberFormat from 'react-number-format';
import { SearchOutlined } from '@ant-design/icons';
import BestSelling from './BestSelling/BestSelling';
import * as _ from 'lodash';

class Reporting extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      products: [],
      productCurrentPage: 1,
      productPageLimit: 10,
      productTotal: 0,
      isLoading: true
    }
  }

  componentDidMount() {
    this.loadData(this.state.month, this.state.year);
  }

  async loadData(month, year) {
    this.props.setAppLoading(true);
    const res = await Promise.all([
      this.loadProducts(1, month, year)
    ]);

    const loadProductResult = res[0];
    this.setState({
      ...loadProductResult,
      productCurrentPage: 1,
      isLoading: false
    });
    this.props.setAppLoading(false);
  }

  async loadProducts(page, month, year) {
    const soldStartDate = new Date(moment(`${month}/${year}`, 'MM/YYYY').startOf('day')).getTime();
    const soldEndDate = new Date(moment(`${moment(new Date(soldStartDate)).daysInMonth()}/${month}/${year}`, 'DD/MM/YYYY').endOf('day')).getTime();

    const res = await (
      await fetch(
        API.Manager.Reporting.getProducts
          .replace('{page}', page)
          .replace('{limit}', this.state.productPageLimit)
          .replace('{soldStartDate}', soldStartDate.toString())
          .replace('{soldEndDate}', soldEndDate.toString()),
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'token': this.props.cookies.get(COOKIE_NAMES.token)
          },
          signal: this.abortController.signal
        }
      )
    ).json();

    if (res.status !== 200) {
      return Promise.reject(res.errors[0]);
    }

    return Promise.resolve({ ...res.data });
  }

  monthCellRender(date) {
    const _date = new Date(date);
    const monthIndex = _date.getMonth();
    return MONTHS[monthIndex];
  }

  onDatePickerChange(e) {
    const selectedDate = new Date(e);
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    this.loadData(month, year);
    this.setState({ month, year });
  }

  async onProductPageChange(page) {
    this.props.setAppLoading(true);
    const res = await this.loadProducts(page);
    this.props.setAppLoading(false);
    this.setState({
      productCurrentPage: page,
      products: res.products
    });
  }

  render() {
    if (this.state.isLoading)
      return null;

    let { month, year, products, productCurrentPage, productPageLimit, productTotal } = this.state;
    products = products.map((p, i) => ({ ...p, key: i }));
    const bestSellingProducts = products.slice(0, 7);
    const importedQuantityTotal = products.reduce((acc, cur) => acc + cur.importedQuantity, 0);
    const importingPriceTotal = products.reduce((acc, cur) => acc + cur.importedQuantity * cur.price, 0);
    const requiredQuantityTotal = products.reduce((acc, cur) => acc + cur.requiredQuantity, 0);
    const requiredPriceTotal = products.reduce((acc, cur) => acc + cur.requiredQuantity * cur.price, 0);
    const importingCompleteRatio = _.round(importedQuantityTotal * 100 / (importedQuantityTotal + requiredQuantityTotal), 2);
    // const soldQuantityTotal = products.reduce((acc, cur) => acc + cur.soldQuantity, 0);
    const isPaginationShown = Math.ceil(productTotal / productPageLimit) > 1;
    const columns = [
      {
        title: '',
        dataIndex: 'image',
        key: 'image',
        width: 60,
        render: (text) => (
          <img
            style={{ width: 25, marginLeft: 10 }}
            src={text}
            alt="product" />
        )
      },
      {
        title: 'Sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 200
      },
      {
        title: 'Thể loại',
        dataIndex: 'category',
        key: 'category',
        width: 180,
        render: (text, record) => (<span>{record.category.name}</span>)
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'supplier',
        key: 'supplier',
        width: 200,
        render: (text, record) => (<span>{record.supplier.name}</span>)
      },
      {
        title: 'Giá bán',
        dataIndex: 'price',
        key: 'price',
        width: 120,
        render: (text) => (
          <NumberFormat
            value={Number(text)}
            displayType="text"
            thousandSeparator={true}
            suffix=" VNĐ"
            style={{ fontWeight: 'bold' }}
          />
        )
      },
      {
        title: 'SL đã nhập',
        dataIndex: 'importedQuantity',
        key: 'importedQuantity',
        width: 80,
        render: (text) => (<center>{text}</center>),
      },
      {
        title: 'SL đã bán',
        dataIndex: 'soldQuantity',
        key: 'soldQuantity',
        width: 80,
        render: (text) => (<center>{text}</center>),
      },
      {
        title: 'SL tồn kho',
        dataIndex: 'availableQuantity',
        key: 'availableQuantity',
        width: 80,
        render: (text) => (<center>{text}</center>),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (text, record) => (
          <center>
            {record.availableQuantity === 0 ? (
              <span style={{ color: 'crimson', fontWeight: 'bold' }}>Hết hàng</span>
            ) : 'Còn hàng'}
          </center>
        )
      },
      {
        title: <center>Mã QR</center>,
        dataIndex: 'qrcode',
        key: 'qrcode',
        render: (value, record) => (
          <center>
            <QRCode
              value={record._id}
              style={{ width: 25, height: 25 }}
            />
          </center>
        )
      }
    ];

    return (
      <div className="reporting animated fadeIn">
        <div className="reporting__header-cover"></div>
        <div className="reporting__header-cover2"></div>
        <div className="reporting__date-picker">
          <span className="reporting__date-picker__label">Chọn tháng:</span>
          <DatePicker
            defaultValue={moment(`${month}/${year}`, 'MM/YYYY')}
            format={'MM/YYYY'}
            picker="month"
            size="small"
            clearIcon={null}
            placeholder={null}
            bordered={false}
            monthCellRender={date => this.monthCellRender(date)}
            onChange={e => this.onDatePickerChange(e)}
          />
        </div>

        <RevenueStatistic
          month={month}
          year={year}
        />

        <div className="product-statistic reporting__block-style animated slideInUp">
          <Row style={{ width: '100%' }}>
            <Col span={24}>
              <div className="product-statistic__products">
                <div className="product-statistic__products__header">
                  <div className="product-statistic__products__header__cover"></div>
                </div>
                <div className="product-statistic__products__statistic">
                  <Row style={{ width: '100%' }} gutter={10}>
                    <Col span={6} style={{ paddingLeft: 0 }}>
                      <div className="product-statistic__products__statistic__item">
                        <div className="product-statistic__products__statistic__item__header">
                          <span className="product-statistic__products__statistic__item__header__title">Tổng thể nhập hàng</span>
                          <div className="product-statistic__products__statistic__item__header__importing-cost">
                            <span>Chi phí đã nhập:</span>
                            <NumberFormat
                              value={importingPriceTotal}
                              displayType="text"
                              thousandSeparator={true}
                              suffix=" VNĐ"
                              className="product-statistic__products__statistic__item__header__importing-cost__number"
                            />
                          </div>
                          <div className="product-statistic__products__statistic__item__header__importing-cost">
                            <span>Chi phí dự kiến:</span>
                            <NumberFormat
                              value={requiredPriceTotal}
                              displayType="text"
                              thousandSeparator={true}
                              suffix=" VNĐ"
                              className="product-statistic__products__statistic__item__header__importing-cost__number"
                            />
                          </div>
                        </div>

                        <div className="product-statistic__products__statistic__item__progress-wrapper">
                          <Progress
                            type="circle"
                            strokeColor={importingCompleteRatio < 100 ? '#ff8220' : ''}
                            percent={importingCompleteRatio}
                            format={percent => (
                              <div className="product-statistic__products__statistic__item__progress-wrapper__progress-inner">
                                <span className="product-statistic__products__statistic__item__progress-wrapper__progress-inner__value">
                                  {importedQuantityTotal}/{requiredQuantityTotal}
                                </span>
                                <span className="product-statistic__products__statistic__item__progress-wrapper__progress-inner__label">
                                  Sản phẩm
                                </span>
                              </div>
                            )}
                          />
                        </div>
                        <div className="product-statistic__products__statistic__item__footer">
                          <Row style={{ width: '100%', height: '100%' }} justify="center">
                            <Col span={12}>
                              <div className="product-statistic__products__statistic__item__footer__col">
                                <span className="product-statistic__products__statistic__item__footer__col__value">
                                  {importedQuantityTotal}
                                </span>
                                <span className="product-statistic__products__statistic__item__footer__col__label">
                                  Sản phẩm đã nhập
                                </span>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div className="product-statistic__products__statistic__item__footer__col">
                                <span className="product-statistic__products__statistic__item__footer__col__value">
                                  {requiredQuantityTotal}
                                </span>
                                <span className="product-statistic__products__statistic__item__footer__col__label">
                                  Sản phẩm cần nhập
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    <Col span={18} style={{ paddingRight: 0 }}>
                      <div className="product-statistic__products__statistic__item">

                      </div>
                    </Col>
                  </Row>
                </div>

                <BestSelling
                  products={[...bestSellingProducts]}
                />

                <div className="product-statistic__products__list">
                  <div className="product-statistic__products__list__header">
                    <Row style={{ width: '100%' }}>
                      <Col span={8}>
                        <h1>
                          Sản phẩm siêu thị
                          <span className="product-statistic__products__list__header__product-total">
                            {this.state.productTotal}
                          </span>
                        </h1>
                      </Col>
                      <Col span={10}></Col>
                      <Col span={6} align="center">
                        <Input
                          prefix={<SearchOutlined style={{ marginRight: 3 }} />}
                          placeholder="Tìm kiếm sản phẩm..."
                          style={{ marginTop: 3 }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="product-statistic__products__list__wrapper">
                    <Table
                      dataSource={[...products]}
                      columns={columns}
                      pagination={isPaginationShown ? {
                        current: productCurrentPage,
                        pageSize: productPageLimit,
                        total: productTotal,
                        onChange: page => this.onProductPageChange(page)
                      } : false}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

      </div>
    )
  }
}
export default connect(null, actions)(withCookies(Reporting));