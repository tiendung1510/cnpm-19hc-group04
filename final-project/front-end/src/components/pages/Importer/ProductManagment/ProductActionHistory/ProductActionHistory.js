import React from 'react';
import { Popover, Button } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { withCookies } from 'react-cookie';
import { API } from '../../../../../constants/api.constant';
import { COOKIE_NAMES } from '../../../../../constants/cookie-name.constant';
import PageBase from '../../../../utilities/PageBase/PageBase';
import './ProductActionHistory.style.scss';
import PRODUCT_ACTION_TYPES from '../../../../../constants/product-action-type.constant';
import moment from 'moment';

class ProductActionHistory extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      isLoading: true
    }
  }

  async componentDidMount() {
    const res = await (
      await fetch(
        API.Importer.ProductManagement.getProductActionLogs,
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
    this.setState({ logs: res.data.productActionLogs, isLoading: false });
  }

  render() {
    if (this.state.isLoading)
      return <></>;

    let { logs } = this.state;
    logs.sort((a, b) => {
      const d1 = new Date(a.createdAt).getTime();
      const d2 = new Date(b.createdAt).getTime();
      return d2 - d1;
    });
    const title = <span>Lịch sử thao tác</span>;
    const content = (
      <div className="product-action-logs">
        {logs.map((l, i) => (
          <div
            key={i}
            className="product-action-logs__item"
          >
            <p className="product-action-logs__item__content">
              {PRODUCT_ACTION_TYPES[l.actionType].name} <strong>{l.product.name}</strong>
            </p>
            <span className="product-action-logs__item__time">Vào lúc {moment(l.createdAt).format('HH:mm DD-MM-YYYY')}</span>
          </div>
        ))}
      </div>
    );

    return (
      <Popover placement="bottomRight" title={title} content={content} trigger="hover">
        <Button
          shape="circle"
          icon={<HistoryOutlined />}
          className="product-management__container__topbar__btn"
        />
      </Popover>
    )
  }
}
export default withCookies(ProductActionHistory);