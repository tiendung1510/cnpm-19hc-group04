import React from 'react';
import './ProductManagement.style.scss';
import { Row, Col, Input, List, Button, Table, Badge, Form, message, InputNumber, Modal, Empty, Dropdown, Menu } from 'antd';
import { SearchOutlined, CloseOutlined, BellFilled, ExclamationCircleOutlined, ShopFilled, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import ImageUploader from '../../../utilities/ImageUploader/ImageUploader';
import * as _ from 'lodash';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/actions';
import AddProductDialog from './AddProductDialog/AddProductDialog';
import AddCategoryDialog from './AddCategoryDialog/AddCategoryDialog';
import { API } from '../../../../constants/api.constant';
import PageBase from '../../../utilities/PageBase/PageBase';
import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import { sortByCreatedAt } from '../../../../services/collection-sorting.service';

const { confirm } = Modal;

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

class ProductManagement extends PageBase {
  constructor(props) {
    super(props);

    this.state = {
      isProductDetailsPanelShown: false,
      selectedProduct: {},
      selectedCategory: {},
      products: [],
      productSearchText: '',
      filteredProducts: [],
      categories: [],
      categorySearchText: '',
      filteredCategories: [],
    }

    this.productDetailsFormRef = React.createRef();
  }

  componentDidMount() {
    this.loadCategories();
  }

  async loadCategories() {
    this.props.setAppLoading(true);
    const res = await (
      await fetch(
        API.Importer.ProductManagement.getCategories,
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

    this.props.setAppLoading(false);
    if (res.status !== 200) {
      message.error(res.errors[0]);
      return;
    }

    const { categories } = res.data;
    let { selectedCategory } = this.state;
    selectedCategory = categories.length > 0 ? { ...categories[0] } : {};

    this.setState({
      categories: [...categories],
      filteredCategories: [...categories],
      selectedCategory
    });

    this.loadCategoryProducts(selectedCategory);
  }

  loadCategoryProducts(category) {
    this.onProductSearchInputChange(this.state.productSearchText, category.products);
    this.setState({ products: category.products, selectedCategory: { ...category } });
  }

  toggleProductDetailsPanel(isToggled) {
    this.setState({ isProductDetailsPanelShown: isToggled });
  }

  handleSelectProduct(product) {
    this.setState({ selectedProduct: { ...product } });
    this.toggleProductDetailsPanel(true);
  }

  handleSelectCategory(category) {
    if (category._id !== this.state.selectedCategory._id) {
      this.loadCategoryProducts(category);
      this.setState({ selectedCategory: category });
    }
  }

  updateProductDetails(values) {
    this.props.setAppLoading(true);
    const params = { ...values };

    //product was updated
    this.props.setAppLoading(false);
    let { products, selectedProduct, selectedCategory } = this.state;
    for (const key in params) {
      if (key !== 'supplier') {
        selectedProduct[key] = params[key];
      } else {
        selectedProduct[key].name = params[key];
      }
    }

    const index = _.findIndex(products, p => p._id === selectedProduct._id);
    if (index >= 0) {
      products[index] = { ...selectedProduct };
    }


    selectedCategory.products = products;
    this.loadCategoryProducts(selectedCategory);

    this.setState({ selectedProduct });

    this.toggleProductDetailsPanel(false);
    message.success('Cập nhật sản phẩm thành công');
  }

  openRemoveProductDialog() {
    const that = this;
    const { selectedProduct } = this.state;
    confirm({
      title: `Bạn muốn xóa sản phẩm ${selectedProduct.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Không, cảm ơn',
      onOk() {
        that.props.setAppLoading(true);

        //Product was removed
        that.props.setAppLoading(false);
        let { products, selectedCategory } = that.state;
        products = products.filter(p => p._id !== selectedProduct._id);

        selectedCategory.products = products;
        that.loadCategoryProducts(selectedCategory);

        that.toggleProductDetailsPanel(false);
        message.success('SUCCESS');
      },
      onCancel() { },
    });
  }

  addToListProducts(product) {
    let { products, selectedCategory } = this.state;
    products.push(product);
    selectedCategory.products = products;
    this.loadCategoryProducts(selectedCategory);
  }

  addToListCategories(category) {
    let { filteredCategories, selectedCategory } = this.state;
    filteredCategories.push({ ...category });
    sortByCreatedAt(filteredCategories);
    selectedCategory = filteredCategories.length > 0 ? filteredCategories[filteredCategories.length - 1] : {};
    this.loadCategoryProducts(selectedCategory);
    this.setState({
      filteredCategories,
      selectedCategory
    });
  }

  onCategorySearchInputChange(text, categories) {
    let { filteredCategories, selectedCategory } = this.state;
    if (!text) {
      filteredCategories = [...categories];
    } else {
      filteredCategories = categories.filter(c => c.name.toLowerCase().includes(text.toLowerCase()));
    }

    selectedCategory = filteredCategories.length > 0 ? filteredCategories[0] : {};
    this.loadCategoryProducts(selectedCategory);

    this.setState({
      filteredCategories,
      selectedCategory,
      categorySearchText: text
    });
  }

  onProductSearchInputChange(text, products) {
    let { filteredProducts, selectedProduct } = this.state;
    if (!text) {
      filteredProducts = [...(products || [])];
    } else {
      filteredProducts = (products || []).filter(p => {
        const keys = [...Object.keys(p)].filter(k => ['name'].includes(k));
        for (const k of keys) {
          if (p[k].toLowerCase().includes(text.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    }

    filteredProducts = (filteredProducts || []).map(p => ({ ...p, key: p._id }));

    if (filteredProducts.length > 0) {
      const index = _.findIndex(filteredProducts, p => p._id === selectedProduct._id);
      if (index >= 0) {
        selectedProduct = { ...filteredProducts[index] };
      } else {
        selectedProduct = { ...filteredProducts[0] };
      }
    } else {
      selectedProduct = {};
    }

    this.setState({
      filteredProducts,
      selectedProduct,
      productSearchText: text
    });
  }

  handleSelectCategoryMenu(e) {
    const { key } = e;
    if (key === 'REMOVE') {
      this.openRemoveCategoryDialog();
    }
  }

  openRemoveCategoryDialog() {
    const that = this;
    const { selectedCategory } = this.state;
    confirm({
      title: `Bạn muốn xóa danh mục ${selectedCategory.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Không, cảm ơn',
      async onOk() {
        that.props.setAppLoading(true);

        //Category was removed
        that.props.setAppLoading(false);
        let { categories } = that.state;
        categories = categories.filter(c => c._id !== selectedCategory._id);
        that.setState({ categories });
        that.onCategorySearchInputChange(that.state.categorySearchText, categories);
        message.success('SUCCESS');
      },
      onCancel() { },
    });
  }

  render() {
    let { selectedProduct } = this.state;
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
        title: 'SL hiện có',
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
        render: (text, record) => (<center>{record.availableQuantity === 0 ? 'SOLD_OUT' : 'AVAILABLE'}</center>),
      }
    ];

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
                      <AddCategoryDialog
                        addToListCategories={category => this.addToListCategories(category)}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="product-management__container__left-sidebar__search-box">
                  <Input
                    prefix={<SearchOutlined style={{ marginRight: 5 }} />}
                    placeholder="Tìm kiếm danh mục..."
                    onChange={e => this.onCategorySearchInputChange(e.target.value, this.state.categories)}
                  />
                </div>
                <div className="product-management__container__left-sidebar__categories">
                  <div className="product-management__container__left-sidebar__categories__wrapper">
                    <List
                      size="small"
                      dataSource={this.state.filteredCategories}
                      renderItem={(item) => (
                        <List.Item onClick={() => this.handleSelectCategory(item)}>
                          <div className={`
                            product-management__container__left-sidebar__categories__item 
                            ${item._id === this.state.selectedCategory._id ? 'product-management__container__left-sidebar__categories__item--selected' : ''}
                          `}>
                            <Row>
                              <Col span={22}>{item.name}</Col>
                              <Col span={2}>{item._id === this.state.selectedCategory._id ? (
                                <Dropdown overlay={
                                  <Menu onClick={e => this.handleSelectCategoryMenu(e)}>
                                    <Menu.Item key="EDIT">Sửa thông tin</Menu.Item>
                                    <Menu.Item key="REMOVE">Xóa</Menu.Item>
                                  </Menu>
                                }>
                                  <EditOutlined />
                                </Dropdown>
                              ) : <></>}
                              </Col>
                            </Row>
                          </div>
                        </List.Item>
                      )}
                      locale={{ emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy" />) }}
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
                        <ShopFilled className="product-management__container__topbar__features__feature__icon" />
                      </div>

                      <div className="product-management__container__topbar__features__feature">
                        <Badge count={100} overflowCount={99} className="product-management__container__topbar__features__feature__label">
                          <BellFilled className="product-management__container__topbar__features__feature__icon product-management__container__topbar__features__feature__icon--bell" />
                        </Badge>
                      </div>

                    </div>
                  </Col>
                  <Col span={7} style={{ paddingRight: 0 }}>
                    <div className="product-management__container__topbar__search-box">
                      <Input
                        prefix={<SearchOutlined style={{ marginRight: 5 }} />}
                        placeholder="Tìm kiếm sản phẩm..."
                        onChange={e => this.onProductSearchInputChange(e.target.value, this.state.selectedCategory.products)}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="product-management__container__content">
                {this.state.isProductDetailsPanelShown && Object.keys(selectedProduct).length > 0 ? (
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
                              className="product-management__container__content__product-details__panel__header__btn-remove-product"
                              onClick={() => this.openRemoveProductDialog()}
                            >
                              Xóa sản phẩm
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      <div className="product-management__container__content__product-details__panel__product-details">
                        <div className="product-management__container__content__product-details__panel__product-details__img">
                          <ImageUploader
                            defaultImageUrl={selectedProduct.image}
                            width={150}
                            height={150}
                            tooltipTitle="Nhấn để thay đổi ảnh"
                            tooltipPlacement="bottom"
                            onFinish={imageUrl => {
                              this.productDetailsFormRef.current.setFieldsValue({
                                image: imageUrl
                              });
                            }}
                          />
                        </div>
                        <div className="product-management__container__content__product-details__panel__product-details__info">
                          <Form
                            {...layout}
                            ref={current => {
                              this.productDetailsFormRef.current = current;
                              if (this.productDetailsFormRef.current) {
                                this.productDetailsFormRef.current.setFieldsValue({
                                  image: selectedProduct.image,
                                  name: selectedProduct.name,
                                  supplier: selectedProduct.supplier ? selectedProduct.supplier.name : '',
                                  price: selectedProduct.price,
                                  availableQuantity: selectedProduct.availableQuantity
                                });
                              }
                            }}
                            onFinish={values => this.updateProductDetails(values)}
                            onFinishFailed={() => message.error('Thông tin sản phẩm chưa đầy đủ')}
                          >

                            <Form.Item name="image" rules={[{ required: true }]} style={{ display: 'none' }}>
                              <Input />
                            </Form.Item>

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
                                  message: 'Vui lòng nhập giá bán'
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
                              label="Số lượng hiện có"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập số lượng hiện có'
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
                    dataSource={[...this.state.filteredProducts]}
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
                    locale={{ emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy sản phẩm" />) }}
                  />
                </div>
                <AddProductDialog
                  selectedCategory={{ ...this.state.selectedCategory }}
                  addToListProducts={product => this.addToListProducts(product)}
                />
              </div>
            </Col>
          </Row>
        </div>

      </div>
    )
  }
}
export default connect(null, actions)(withCookies(ProductManagement));
