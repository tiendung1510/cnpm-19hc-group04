import React from 'react';
import './MoneyCounting.style.scss';
import PageBase from '../../../utilities/PageBase/PageBase';
import { withCookies } from 'react-cookie';
import QrReader from 'react-qr-reader';
import { Row, Col, Empty, notification, Button, Tooltip, Table, Modal } from 'antd';
import { ReloadOutlined, ShoppingCartOutlined, RightOutlined, QuestionCircleOutlined, ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import checkoutSound from '../../../../assets/sounds/cashing.wav';
// import moment from 'moment';

const { confirm } = Modal;

const columns = [
  {
    title: <center>STT</center>,
    dataIndex: 'order',
    key: 'order',
    width: 80,
    render: order => <center>{order}</center>
  },
  {
    title: 'Sản phẩm',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div className="money-counting__panel__right__shopping-cart__list-products__item">
        {record.image ? (<img src={record.image} alt="product" />) : (<QuestionCircleOutlined />)}
        <span className="money-counting__panel__right__shopping-cart__list-products__item__name">{text}</span>
      </div>
    )
  },
  {
    title: 'Giá bán',
    dataIndex: 'price',
    key: 'price',
    width: 150,
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
    title: 'Danh mục',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Nhà cung cấp',
    dataIndex: 'supplier',
    key: 'supplier',
  }
];

class MoneyCounting extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      scannedProduct: null,
      checkedOutProducts: [],
      priceTotal: 0,
      onWorking: true
    }
    this.soundRef = React.createRef();
  }

  openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description
    });
  };

  handleScan = data => {
    if (data) {
      this.playCheckoutSound();
      const productDetails = JSON.parse(data);
      this.openNotificationWithIcon('success', `${productDetails.name}`, '');

      let { checkedOutProducts, priceTotal } = this.state;
      checkedOutProducts.push({
        key: productDetails._id,
        order: checkedOutProducts.length + 1,
        name: productDetails.name,
        price: productDetails.price,
        category: productDetails.category.name,
        supplier: productDetails.supplier.name,
        image: productDetails.image
      });

      priceTotal = checkedOutProducts.reduce((pre, cur) => {
        return pre + cur.price;
      }, 0);

      this.setState({
        scannedProduct: { ...productDetails },
        checkedOutProducts,
        priceTotal
      });
    }
  }

  handleError = error => {
    if (error) {
      this.openNotificationWithIcon('error', 'Chưa tìm thấy sản phẩm', '');
    }
  }

  clearScannedProduct() {
    this.setState({ scannedProduct: null });
  }

  playCheckoutSound() {
    this.soundRef.play();
  }

  setOnWorking(onWorking) {
    this.setState({ onWorking });
    this.props.setOnWorking(onWorking);
  }

  backToGettingStarted() {
    const that = this;
    confirm({
      title: `Đang thao tác, bạn có muốn rời khỏi?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Không, cảm ơn',
      onOk() {
        that.setOnWorking(false);
        that.props.setOnWorking(false);
      }
    });
  }

  render() {
    const { scannedProduct, checkedOutProducts, priceTotal, onWorking } = this.state;

    return (
      <div className="money-counting">
        {!onWorking ? (
          <div className="money-counting__getting-started animated fadeIn">
            <div className="money-counting__getting-started__dark-cover"></div>
            <Button
              type="submit"
              className="money-counting__getting-started__btn-start animated bounceInUp"
              onClick={() => this.setOnWorking(true)}
            >Bắt đầu tính tiền</Button>
          </div>
        ) : (
            <div style={{ height: '100%' }}>
              <audio ref={ref => { this.soundRef = ref; }} src={checkoutSound} controls autoPlay style={{ display: 'none' }} />
              <div className="money-counting__panel">
                <Row>
                  <Col span={6}>
                    <div className="money-counting__panel__left">
                      <div className="money-counting__panel__left__header">
                        <Button
                          shape="circle"
                          icon={<ArrowLeftOutlined />}
                          className="money-counting__panel__left__header__btn-back"
                          onClick={() => this.backToGettingStarted()}
                        />
                        <div className="money-counting__panel__left__header__company">
                          <img className="money-counting__panel__left__header__company__logo" src={require('../../../../assets/images/app-logo.png')} alt="logo" />
                          <div className="money-counting__panel__left__header__company__brand">
                            <div className="money-counting__panel__left__header__company__brand__name"><span>Mini Mart</span></div>
                            <div className="money-counting__panel__left__header__company__brand__slogan"><span>Tiện Lợi mà Chất Lượng</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="money-counting__panel__left__product-scanning animated fadeIn">
                        <QrReader
                          delay={1500}
                          onError={error => this.handleError(error)}
                          onScan={data => this.handleScan(data)}
                          className="money-counting__panel__left__product-scanning__scanner"
                        />
                      </div>
                      <div className="money-counting__panel__left__product-details">
                        <Row align="middle">
                          <Col span={21}><h3>Thông tin sản phẩm</h3></Col>
                          <Col span={3} align="center">
                            <Tooltip title="Làm mới" placement="bottom">
                              <Button
                                shape="circle" icon={<ReloadOutlined />}
                                className="money-counting__panel__left__product-details__btn-clear"
                                onClick={() => this.clearScannedProduct()}
                              />
                            </Tooltip>
                          </Col>
                        </Row>
                        {scannedProduct ? (
                          <Row gutter={20}>
                            <Col span={8}>
                              <ul className="money-counting__panel__left__product-details__labels">
                                <li>Tên sản phẩm</li>
                                <li>Giá bán</li>
                                <li>Thể loại</li>
                                <li>Nhà phân phối</li>
                              </ul>
                            </Col>
                            <Col span={16}>
                              <ul className="money-counting__panel__left__product-details__texts">
                                <li>{scannedProduct.name}</li>
                                <li>
                                  <NumberFormat
                                    value={scannedProduct.price}
                                    displayType="text"
                                    thousandSeparator={true}
                                    suffix=" VNĐ"
                                    style={{ fontWeight: 'bold' }} />
                                </li>
                                <li>{scannedProduct.category.name}</li>
                                <li>{scannedProduct.supplier.name}</li>
                              </ul>
                            </Col>
                          </Row>
                        ) : (
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description="Chưa tìm thấy"
                              className="money-counting__panel__left__product-details__empty" />
                          )}
                      </div>
                    </div>
                  </Col>
                  <Col span={18}>
                    <div className="money-counting__panel__right">
                      <div className="money-counting__panel__right__header">
                        <Row>
                          <Col span={18}>
                            <h3 className="money-counting__panel__right__header__title">
                              <div className="money-counting__panel__right__header__title__icon-wrapper">
                                <ShoppingCartOutlined className="money-counting__panel__right__header__title__icon-wrapper__icon" />
                              </div>
                              <span>Giỏ hàng của khách</span>
                            </h3>
                          </Col>
                          <Col span={6}>
                            <div className="money-counting__panel__right__header__btn-done-checkout-wrapper">
                              <Button
                                className="money-counting__panel__right__header__btn-done-checkout-wrapper__btn"
                                type="primary"
                                disabled={checkedOutProducts.length === 0}
                              >
                                <span style={{ marginRight: 5 }}>Xuất hóa đơn</span>
                                <RightOutlined />
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="money-counting__panel__right__shopping-cart">
                        <div className="money-counting__panel__right__shopping-cart__list-products">
                          <Table
                            dataSource={[...checkedOutProducts]}
                            columns={columns}
                            pagination={false}
                            scroll={{ y: 355 }}
                            locale={{ emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có sản phẩm" />) }}
                          />
                        </div>
                        <div className="money-counting__panel__right__shopping-cart__details">
                          <Row gutter={20}>
                            <Col span={5}>
                              <ul className="money-counting__panel__right__shopping-cart__details__labels">
                                <li>Số lượng sản phẩm</li>
                                <li>Tổng tiền</li>
                              </ul>
                            </Col>
                            <Col span={19}>
                              <ul>
                                <li>{checkedOutProducts.length}</li>
                                <li>
                                  <NumberFormat
                                    value={priceTotal}
                                    displayType="text"
                                    thousandSeparator={true}
                                    suffix=" VNĐ"
                                    className="money-counting__panel__right__shopping-cart__details__price-total"
                                  />
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
      </div>
    )
  }
}
export default withCookies(MoneyCounting)
