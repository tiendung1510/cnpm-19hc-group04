import React from 'react';
import { DatePicker, Row, Col, Table, Input, Button, Tooltip } from 'antd';
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
import { SearchOutlined, PrinterFilled } from '@ant-design/icons';
import BestSelling from './BestSelling/BestSelling';
import ImportingStatistic from './ImportingStatistic/ImportingStatistic';
import ProductQuantityStatistic from './ProductQuantityStatistic/ProductQuantityStatistic';
import ReportToPrint from './ReportToPrint/ReportToPrint';
import ReactToPrint from 'react-to-print';
import SupplierContactPopover from '../../../utilities/SupplierContactPopover/SupplierContactPopover';

class Reporting extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      products: [],
      bestSellingProducts: [],
      soldProducts: [],
      importedProducts: [],
      newProducts: [],
      sellingHistories: [],
      importedQuantityTotal: 0,
      requiredQuantityTotal: 0,
      importingCostTotal: 0,
      requiredImportingCostTotal: 0,
      soldQuantityTotal: 0,
      newProductTotal: 0,
      revenueTotal: 0,
      paymentTotal: 0,
      salaryTotal: 0,
      revenueStatisticData: [],
      soldQuantityStatisticData: [],
      productCurrentPage: 1,
      productPageLimit: 10,
      productTotal: 0,
      isLoading: true
    }
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidMount() {
    this.loadData(this.state.month, this.state.year);
  }

  async loadData(month, year) {
    try {
      this.props.setAppLoading(true);
      const res = await Promise.all([
        this.loadProducts(1, month, year)
      ]);
      this.props.setAppLoading(false);
      const loadProductResult = res[0];
      this.setState({
        ...loadProductResult,
        productCurrentPage: 1,
        isLoading: false
      });
    } catch (error) {
      return error;
    }
  }

  async loadProducts(page, month, year) {
    try {
      const statisticStartDate = new Date(moment(`${month}/${year}`, 'MM/YYYY').startOf('day')).getTime();
      const statisticEndDate = new Date(moment(`${moment(new Date(statisticStartDate)).daysInMonth()}/${month}/${year}`, 'DD/MM/YYYY').endOf('day')).getTime();

      const res = await (
        await fetch(
          API.Manager.Reporting.getProducts
            .replace('{page}', page)
            .replace('{limit}', this.state.productPageLimit)
            .replace('{statisticStartDate}', statisticStartDate.toString())
            .replace('{statisticEndDate}', statisticEndDate.toString()),
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
    } catch (error) {
      return error;
    }
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
    try {
      const res = await this.loadProducts(page);
      this.setState({
        productCurrentPage: page,
        products: res.products
      });
    } catch (error) {
      return error;
    }
  }

  render() {
    let {
      month,
      year,
      products,
      bestSellingProducts,
      importedQuantityTotal,
      requiredQuantityTotal,
      importingCostTotal,
      requiredImportingCostTotal,
      soldQuantityTotal,
      newProductTotal,
      revenueTotal,
      paymentTotal,
      revenueStatisticData,
      soldQuantityStatisticData,
      productCurrentPage,
      productPageLimit,
      productTotal
    } = this.state;
    products = products.map((p, i) => ({ ...p, key: i }));
    const isPaginationShown = Math.ceil(productTotal / productPageLimit) > 1;
    const columns = [
      {
        title: '',
        dataIndex: 'image',
        key: 'image',
        width: '3.75rem',
        render: (text) => (
          <img
            style={{ width: '1.5625rem', marginLeft: '0.625rem' }}
            src={text}
            alt="product" />
        )
      },
      {
        title: 'Sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width: '12.5rem'
      },
      {
        title: 'Thể loại',
        dataIndex: 'category',
        key: 'category',
        width: '11.25rem',
        render: (text, record) => (<span>{record.category.name}</span>)
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'supplier',
        key: 'supplier',
        width: '12.5rem',
        render: (text, record) => (
          <SupplierContactPopover
            supplier={{ ...record.supplier }}
            buttonText={record.supplier.name}
            buttonStyle={{ fontSize: '0.6875rem' }}
            placement="right"
          />
        )
      },
      {
        title: 'Giá bán',
        dataIndex: 'price',
        key: 'price',
        width: '7.5rem',
        sorter: (a, b) => a.price - b.price,
        render: (text) => (
          <NumberFormat
            value={Number(text)}
            displayType="text"
            thousandSeparator={true}
            suffix=" đ̲"
          />
        )
      },
      {
        title: `SL đã nhập (Th${this.state.month}/${this.state.year})`,
        dataIndex: 'importedQuantity',
        key: 'importedQuantity',
        width: '5rem',
        sorter: (a, b) => a.importedQuantity - b.importedQuantity,
        render: (text) => (<center>{text}</center>)
      },
      {
        title: `SL đã bán (Th${this.state.month}/${this.state.year})`,
        dataIndex: 'soldQuantity',
        key: 'soldQuantity',
        width: '5rem',
        sorter: (a, b) => a.soldQuantity - b.soldQuantity,
        render: (text) => (<center>{text}</center>)
      },
      {
        title: 'SL tồn kho',
        dataIndex: 'availableQuantity',
        key: 'availableQuantity',
        width: '5rem',
        sorter: (a, b) => a.availableQuantity - b.availableQuantity,
        render: (text) => (<center>{text}</center>)
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: '6.25rem',
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
              style={{ width: '1.5625rem', height: '1.5625rem' }}
            />
          </center>
        )
      }
    ];

    return (
      <div className="reporting">
        <div className="reporting__header-cover"></div>
        <div className="reporting__header-cover2"></div>
        <ReactToPrint
          trigger={() => (
            <Tooltip title="In báo cáo" placement="left">
              <Button
                className="reporting__btn-print-report"
                shape="circle"
                type="primary"
                icon={<PrinterFilled />}
              />
            </Tooltip>
          )}
          content={() => this.reportToPrintRef}
        />
        <div className="reporting__report-to-print">
          <ReportToPrint
            ref={el => (this.reportToPrintRef = el)}
            soldProducts={[...this.state.soldProducts]}
            importedProducts={[...this.state.importedProducts]}
            sellingRevenueTotal={this.state.revenueTotal}
            salaryTotal={this.state.salaryTotal}
            importingCostTotal={this.state.importingCostTotal}
            month={this.state.month}
            year={this.state.year}
          />
        </div>
        <div className="reporting__header">
          <div className="reporting__header__date-picker">
            <span className="reporting__header__date-picker__label">Chọn tháng:</span>
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

        </div>

        <RevenueStatistic
          month={month}
          year={year}
          revenueTotal={revenueTotal}
          paymentTotal={paymentTotal}
          salaryTotal={this.state.salaryTotal}
          importingCostTotal={importingCostTotal}
          statisticData={[...revenueStatisticData]}
        />

        <div className="product-statistic reporting__block-style">
          <Row style={{ width: '100%' }}>
            <Col span={24}>
              <div className="product-statistic__products">
                <div className="product-statistic__products__header">
                  <div className="product-statistic__products__header__cover"></div>
                </div>
                <div className="product-statistic__products__statistic">
                  <Row style={{ width: '100%' }} gutter={[0, 10]}>

                    <Col span={6} xs={24} md={6} style={{ paddingLeft: 0 }}>
                      <ImportingStatistic
                        importedProducts={[...this.state.importedProducts]}
                        importedQuantityTotal={importedQuantityTotal}
                        requiredQuantityTotal={requiredQuantityTotal}
                        importingCostTotal={importingCostTotal}
                        requiredImportingCostTotal={requiredImportingCostTotal}
                      />
                    </Col>

                    <Col span={18} xs={24} md={18} style={{ paddingRight: 0 }}>
                      <div className="product-statistic__products__statistic__item">
                        <ProductQuantityStatistic
                          soldQuantityTotal={soldQuantityTotal}
                          newProductTotal={newProductTotal}
                          availableQuantityTotal={productTotal}
                          soldQuantityStatisticData={[...soldQuantityStatisticData]}
                          sellingHistories={[...this.state.sellingHistories]}
                          newProducts={[...this.state.newProducts]}
                        />
                        <BestSelling
                          products={[...bestSellingProducts]}
                        />
                      </div>
                    </Col>

                  </Row>
                </div>

                <div className="product-statistic__products__list">
                  <div className="product-statistic__products__list__header">
                    <Row style={{ width: '100%' }} gutter={{ xs: [10, 10] }}>
                      <Col span={8} xs={24} md={8}>
                        <h1>
                          Sản phẩm siêu thị
                          <span className="product-statistic__products__list__header__product-total">
                            {this.state.productTotal}
                          </span>
                        </h1>
                      </Col>
                      <Col span={10} xs={0} md={10}></Col>
                      <Col span={6} align="center" xs={24} md={6}>
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