import React, { Component } from 'react';
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import { Card } from 'antd';
import './BestSelling.style.scss';

const { Meta } = Card;
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30
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
    const { deviceType } = this.state;
    return (
      <div className="product-statistic__products__best-selling">
        <h1>
          Sản phẩm bán chạy
                    <div className="product-statistic__products__best-selling__hot-badge">HOT</div>
        </h1>
        <div className="product-statistic__products__best-selling__items">
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
                <Card
                  cover={<img alt="example" src={p.image} />}
                  key={i}
                >
                  <Meta title={p.name} description={<span>SL đã bán: <strong>{p.soldQuantity}</strong></span>} />
                </Card>
              );
            })}
          </Carousel>
        </div>
      </div>
    )
  }
}