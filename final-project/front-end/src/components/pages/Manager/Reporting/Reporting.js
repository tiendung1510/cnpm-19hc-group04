import React from 'react';
import { DatePicker, Row, Col, Card } from 'antd';
import './Reporting.style.scss';
import PageBase from '../../../utilities/PageBase/PageBase';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/actions';
import { withCookies } from 'react-cookie';
// import { API } from '../../../../constants/api.constant';
// import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import moment from 'moment';
import RevenueStatistic from './RevenueStatistic/RevenueStatistic';
import MONTHS from '../../../../constants/months.constant';

const { Meta } = Card;
const image = 'data:image/jpeg;base64,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';

class Reporting extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
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
    this.setState({ month, year });
  }

  render() {
    const { month, year } = this.state;
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

        <div className="product-statistic reporting__block-style">
          <Row style={{ width: '100%' }}>
            <Col span={24}>
              <div className="product-statistic__products">
                <div className="product-statistic__products__header">
                  <div className="product-statistic__products__header__cover"></div>
                </div>
                <div className="product-statistic__products__statistic">
                  <Row style={{ width: '100%' }} gutter={20}>
                    <Col span={8} style={{ paddingLeft: 0 }}><div className="product-statistic__products__statistic__item"></div></Col>
                    <Col span={8}><div className="product-statistic__products__statistic__item"></div></Col>
                    <Col span={8} style={{ paddingRight: 0 }}><div className="product-statistic__products__statistic__item"></div></Col>
                  </Row>
                </div>
                <div className="product-statistic__products__best-seller">
                  <h1>
                    Sản phẩm bán chạy
                    <div className="product-statistic__products__best-seller__hot-badge">HOT</div>
                  </h1>
                  <div className="product-statistic__products__best-seller__items">
                    <Card
                      hoverable
                      style={{ width: 150 }}
                      cover={<img alt="example" src={image} />}
                    >
                      <Meta title="IPhoneX 256GB" description={<span>SL đã bán: <strong>95</strong></span>} />
                    </Card>
                    <Card
                      hoverable
                      style={{ width: 150 }}
                      cover={<img alt="example" src={image} />}
                    >
                      <Meta title="IPhoneX 256GB" description={<span>SL đã bán: <strong>95</strong></span>} />
                    </Card>
                    <Card
                      hoverable
                      style={{ width: 150 }}
                      cover={<img alt="example" src={image} />}
                    >
                      <Meta title="IPhoneX 256GB" description={<span>SL đã bán: <strong>95</strong></span>} />
                    </Card>
                    <Card
                      hoverable
                      style={{ width: 150 }}
                      cover={<img alt="example" src={image} />}
                    >
                      <Meta title="IPhoneX 256GB" description={<span>SL đã bán: <strong>95</strong></span>} />
                    </Card>
                    <Card
                      hoverable
                      style={{ width: 150 }}
                      cover={<img alt="example" src={image} />}
                    >
                      <Meta title="IPhoneX 256GB" description={<span>SL đã bán: <strong>95</strong></span>} />
                    </Card>
                    <Card
                      hoverable
                      style={{ width: 150 }}
                      cover={<img alt="example" src={image} />}
                    >
                      <Meta title="IPhoneX 256GB" description={<span>SL đã bán: <strong>95</strong></span>} />
                    </Card>
                    <Card
                      hoverable
                      style={{ width: 150 }}
                      cover={<img alt="example" src={image} />}
                    >
                      <Meta title="IPhoneX 256GB" description={<span>SL đã bán: <strong>95</strong></span>} />
                    </Card>
                  </div>
                </div>
                <div className="product-statistic__products__list"></div>
              </div>
            </Col>
          </Row>
        </div>

      </div>
    )
  }
}
export default connect(null, actions)(withCookies(Reporting));