import React, { Component } from 'react';
import './ProductManagement.style.scss';
import { Row, Col, Input, List, Button, Table, Badge, Form, message, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined, CloseOutlined, BellFilled, PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import NumberFormat from 'react-number-format';

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const categories = [
  {
    _id: 1,
    name: 'Sữa tiệt trùng'
  },
  {
    _id: 2,
    name: 'Dụng cụ làm bếp'
  },
  {
    _id: 3,
    name: 'Văn phòng phẩm'
  },
  {
    _id: 4,
    name: 'Đồ gia dụng'
  }
];

let dataSource = [];

for (let i = 0; i < 20; i++) {
  const data = {
    "name": "Sữa bò tươi có đường",
    "image": "https://product.hstatic.net/1000074072/product/1l-c_-d__ng-min.png",
    "price": 8000,
    "availableQuantity": 7,
    "_id": "5e70f8e809d06d1841aea689" + i,
    "category": {
      "name": "Sữa tiệt trùng",
      "_id": "5e70eb4acac22205b7530292",
      "createdAt": "2020-03-17T15:22:50.312Z",
      "updatedAt": "2020-03-18T14:49:47.494Z",
      "__v": 10
    },
    "supplier": {
      "phone": "0999999999",
      "address": "New York",
      "_id": "5e70eb46cac22205b7530291",
      "name": "Vinamilk",
      "createdAt": "2020-03-17T15:22:46.783Z",
      "updatedAt": "2020-03-18T14:49:47.609Z",
      "__v": 10
    },
    "status": 'SOLD_OUT',
    "createdAt": "2020-03-17T16:20:57.002Z",
    "updatedAt": "2020-03-18T02:27:51.388Z",
    "__v": 0,
    key: i
  }
  dataSource.push(data);
}

const columns = [
  {
    title: '',
    dataIndex: 'image',
    key: 'image',
    width: 40,
    render: (text) => (
      <img
        className="product-management__container__content__list-products__product-img"
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
    title: 'Nhà cung cấp',
    dataIndex: 'supplier',
    key: 'supplier',
    width: 150,
    render: (text, record) => (<span>{record.supplier.name}</span>)
  },
  {
    title: 'Giá bán',
    dataIndex: 'price',
    key: 'price',
    width: 100,
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
    title: 'SL có sẵn',
    dataIndex: 'availableQuantity',
    key: 'availableQuantity',
    width: 120,
    render: (text) => (<center>{text}</center>),
  },
  {
    title: 'Cập nhật lần cuối',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 150,
    render: (text) => (<span>Lúc {moment(text).format('HH:mm DD-MM-YYYY')}</span>)
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    render: (text) => (<center>{text}</center>),
  }
];

export default class ProductManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isProductDetailsPanelShown: false,
      selectedProduct: { ...dataSource[0] },
      selectedCategory: { ...categories[0] }
    }

    this.productDetailsFormRef = React.createRef();
  }

  toggleProductDetailsPanel(isToggled) {
    this.setState({ isProductDetailsPanelShown: isToggled });
  }

  handleSelectProduct(product) {
    this.setState({ selectedProduct: product });
    this.toggleProductDetailsPanel(true);
  }

  handleSelectCategory(category) {
    this.setState({ selectedCategory: category });
  }

  updateProductDetails(values) {
    console.log(values);
  }

  render() {
    const { selectedProduct } = this.state;
    return (
      <div className="product-management animated fadeIn">

        <div className="product-management__container">
          <Row>
            <Col span={4}>
              <div className="product-management__container__left-sidebar">
                <div className="product-management__container__left-sidebar__title">
                  <Row align="middle">
                    <Col span={20}>
                      <span className="product-management__container__left-sidebar__title__text">
                        Danh mục sản phẩm
                      </span>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                      <PlusCircleOutlined className="product-management__container__left-sidebar__title__btn-add-category" />
                    </Col>
                  </Row>
                </div>
                <div className="product-management__container__left-sidebar__search-box">
                  <Input
                    prefix={<SearchOutlined style={{ marginRight: 5 }} />}
                    placeholder="Tìm kiếm danh mục..." />
                </div>
                <div className="product-management__container__left-sidebar__categories">
                  <div className="product-management__container__left-sidebar__categories__wrapper">
                    <List
                      size="small"
                      dataSource={categories}
                      renderItem={(item) => (
                        <List.Item onClick={() => this.handleSelectCategory(item)}>
                          <div className={`
                            product-management__container__left-sidebar__categories__item 
                            ${item._id === this.state.selectedCategory._id ? 'product-management__container__left-sidebar__categories__item--selected' : ''}
                          `}>
                            {item.name}
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col span={20}>
              <div className="product-management__container__topbar">
                <Row align="middle" gutter={40}>
                  <Col span={8}>
                    <h3 className="product-management__container__topbar__title">
                      {this.state.selectedCategory.name}
                    </h3>
                  </Col>
                  <Col span={9}>
                    <div className="product-management__container__topbar__features">
                      <div className="product-management__container__topbar__features__feature">
                        <Badge count={100} overflowCount={99} className="product-management__container__topbar__features__feature__label">
                          <BellFilled className="product-management__container__topbar__features__feature__icon" />
                        </Badge>
                      </div>
                    </div>
                  </Col>
                  <Col span={7} style={{ paddingRight: 0 }}>
                    <div className="product-management__container__topbar__search-box">
                      <Input
                        prefix={<SearchOutlined style={{ marginRight: 5 }} />}
                        placeholder="Tìm kiếm sản phẩm..." />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="product-management__container__content">
                {this.state.isProductDetailsPanelShown ? (
                  <div className="product-management__container__content__product-details">
                    <div className="product-management__container__content__product-details__panel animated slideInRight">
                      <div className="product-management__container__content__product-details__panel__header">
                        <Row>
                          <Col span={4}>
                            <Button
                              shape="circle"
                              icon={<CloseOutlined />}
                              className="product-management__container__content__product-details__panel__header__btn-close"
                              onClick={() => this.toggleProductDetailsPanel(false)}
                            />
                          </Col>
                          <Col align="end" span={20}>
                            <Button
                              type="link"
                              className="product-management__container__content__product-details__panel__header__btn-remove-product">
                              Xóa sản phẩm
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      <div className="product-management__container__content__product-details__panel__product-details">
                        <div className="product-management__container__content__product-details__panel__product-details__img">
                          <img src={selectedProduct.image} alt="product" />
                        </div>
                        <div className="product-management__container__content__product-details__panel__product-details__info">
                          <Form
                            {...layout}
                            ref={current => {
                              this.productDetailsFormRef.current = current;
                              if (this.productDetailsFormRef.current) {
                                this.productDetailsFormRef.current.setFieldsValue({
                                  name: selectedProduct.name,
                                  supplier: selectedProduct.supplier.name,
                                  price: selectedProduct.price,
                                  availableQuantity: selectedProduct.availableQuantity
                                });
                              }
                            }}
                            onFinish={values => this.updateProductDetails(values)}
                            onFinishFailed={() => message.error('Thông tin sản phẩm chưa đầy đủ')}
                          >
                            <Form.Item
                              name="name"
                              label="Tên sản phẩm"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập tên sản phẩm'
                                }
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              name="supplier"
                              label="Nhà cung cấp"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập tên nhà cung cấp'
                                }
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              name="price"
                              label="Giá bán (VNĐ)"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập giá bán sản phẩm'
                                }
                              ]}
                            >
                              <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              />
                            </Form.Item>

                            <Form.Item
                              name="availableQuantity"
                              label="Số lượng có sẵn"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập số lượng có sẵn'
                                }
                              ]}
                            >
                              <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              />
                            </Form.Item>

                            <Form.Item>
                              <div className="product-management__container__content__product-details__panel__product-details__btn-update__wrapper">
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className="product-management__container__content__product-details__panel__product-details__btn-update__wrapper__btn"
                                >
                                  Cập nhật sản phẩm
                                </Button>
                              </div>
                            </Form.Item>

                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : <></>}
                <div className="product-management__container__content__list-products">
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ y: 545 }}
                    pagination={false}
                    onRow={(record) => {
                      return {
                        onClick: () => this.handleSelectProduct(record)
                      }
                    }}
                    rowClassName={record => record._id === selectedProduct._id ?
                      'product-management__container__content__list-products__selected-row' : ''}
                  />
                </div>
                <Button
                  shape="circle"
                  icon={<PlusOutlined />}
                  className="product-management__container__content__btn-add-product"
                />
              </div>
            </Col>
          </Row>
        </div>

      </div>
    )
  }
}
