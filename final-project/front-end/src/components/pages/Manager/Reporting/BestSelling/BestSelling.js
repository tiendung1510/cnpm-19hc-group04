import React, { Component } from 'react';
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import { Card, Popover, Row, Col } from 'antd';
import './BestSelling.style.scss';
import NumberFormat from 'react-number-format';

const { Meta } = Card;
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};

export default class BestSelling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceType: 'desktop'
    }
  }
  render() {
    const { products } = this.props;
    // if (products.length > 0) {
    //   for (let i = 1; i <= 7; i++)
    //     products.push(products[0]);
    // }
    const { deviceType } = this.state;
    return (
      <div className="product-statistic__products__best-selling">
        <h1>
          Sản phẩm bán chạy
          <span className="product-statistic__products__best-selling__hot-badge">HOT</span>
        </h1>
        {products.length === 0 ? (
          <div className="product-statistic__products__best-selling__item" style={{ paddingLeft: 5 }}>
            <p>Chưa ghi nhận.</p>
          </div>
        ) : (
            <div className="product-statistic__products__best-selling__item">
              <Carousel
                swipeable={false}
                draggable={true}
                ssr={true} // means to render carousel on server-side.
                keyBoardControl={true}
                responsive={responsive}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={deviceType}
                itemClass="carousel-item-padding-40-px"
              >
                {products.map((p, i) => {
                  return (
                    <Popover
                      key={i}
                      overlayClassName="product-statistic__products__best-selling__item__details"
                      placement="top"
                      title={p.details.name}
                      content={
                        <div>
                          <Row style={{ width: '100%' }} gutter={10}>
                            <Col span={8}>Thể loại</Col>
                            <Col span={16}>{p.category.name}</Col>
                          </Row>
                          <Row style={{ width: '100%' }} gutter={10}>
                            <Col span={8}>Nhà cung cấp</Col>
                            <Col span={16}>{p.supplier.name}</Col>
                          </Row>
                          <Row style={{ width: '100%' }} gutter={10}>
                            <Col span={8}>Giá bán</Col>
                            <Col span={16}>
                              <NumberFormat
                                value={p.details.price}
                                displayType="text"
                                thousandSeparator={true}
                                suffix=" đ̲"
                                style={{ fontWeight: 'bold' }}
                              />
                            </Col>
                          </Row>
                          <Row style={{ width: '100%' }} gutter={10}>
                            <Col span={8}>SL đã bán</Col>
                            <Col span={16}>{p.quantity}</Col>
                          </Row>
                          <Row style={{ width: '100%' }} gutter={10}>
                            <Col span={8}>SL tồn kho</Col>
                            <Col span={16}>{p.details.availableQuantity}</Col>
                          </Row>
                        </div>
                      }
                      trigger="click">
                      <Card
                        className="animated zoomIn"
                        cover={<img alt="example" src={p.details.image} />}
                        key={i}
                        style={{ animationDelay: `${0.2 * i}s` }}
                      >
                        <Meta title={p.details.name} description={<span>SL đã bán: <strong>{p.quantity}</strong></span>} />
                      </Card>
                    </Popover>

                  );
                })}
              </Carousel>
            </div>
          )}
      </div>
    )
  }
}