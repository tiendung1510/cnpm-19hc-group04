import React from 'react';
import './ImportingRequestHistory.style.scss';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/actions';
import { MessageOutlined } from '@ant-design/icons';
import { Timeline, Empty, message } from 'antd';
import moment from 'moment';
import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import { API } from '../../../../constants/api.constant';
import PageBase from '../../../utilities/PageBase/PageBase';
import IMPORTING_REQUEST from '../../../../constants/importing-request.constant';

class ImportingRequestHistory extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      importingRequests: [],
      isLoading: true
    }
  }

  componentDidMount() {
    this.loadImportingRequests();
  }

  async loadImportingRequests() {
    this.props.setAppLoading(true);
    const res = await (
      await fetch(
        API.Cashier.Checkout.getImportingRequests,
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

    this.setState({ importingRequests: res.data.importingRequests, isLoading: false });
  }

  render() {
    const { importingRequests } = this.state;
    return (
      <div className="importing-request-history animated fadeIn">
        <div className="importing-request-history__header">
          <div className="importing-request-history__header__title">
            <MessageOutlined className="importing-request-history__header__title__icon" />
            <span className="importing-request-history__header__title__text">Yêu cầu nhập hàng</span>
          </div>
        </div>
        {!this.state.isLoading ? (
          <div className="importing-request-history__content animated slideInUp">
            <div className="importing-request-history__content__timeline">
              {importingRequests.length === 0 ? (
                <div className="importing-request-history__content__timeline__empty">
                  <Empty description="Chưa có ghi nhận nào" />
                </div>
              ) : (
                  <Timeline mode="left">
                    {importingRequests.map(r => {
                      return r.requiredProducts.length > 0 ? (
                        <Timeline.Item
                          key={r._id}
                          label={r.createdAt ? moment(r.createdAt).format('DD-MM-YYYY HH:mm') : moment().format('DD-MM-YYYY HH:mm')}
                          color="#ff8220">
                          <div className="importing-request-history__content__timeline__item animated fadeInRight" style={{ animationDelay: '0.5s' }}>
                            <p className="importing-request-history__content__timeline__item__list-products">
                              {r.requiredProducts.map((item, index) => {
                                return index < r.requiredProducts.length - 1 ? (
                                  <span key={index}>{`${item.product.name}, `}</span>
                                ) : (
                                    <span key={index}>{`${item.product.name}.`}</span>
                                  )
                              })}
                            </p>
                            <span style={{ color: 'rgba(0,0,0,0.4)' }}>
                              Trạng thái:
                              <span
                                className={`importing-request-history__content__timeline__item__status --${r.status}`}
                              >
                                {IMPORTING_REQUEST.STATUS[r.status].name}
                              </span>
                            </span>
                          </div>
                        </Timeline.Item>
                      ) : <></>
                    })}
                  </Timeline>
                )}
            </div>
          </div>
        ) : <></>}
      </div>
    )
  }
}
export default connect(null, actions)(withCookies(ImportingRequestHistory));
