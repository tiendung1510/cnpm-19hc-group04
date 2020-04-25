import React, { Component } from 'react';
import { Row, Col, Progress, Tooltip, Button } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import * as _ from 'lodash';
import './ImportingStatistic.style.scss';

export default class ImportingStatistic extends Component {
  render() {
    const {
      importedQuantityTotal,
      requiredQuantityTotal,
      importingCostTotal,
      requiredImportingCostTotal
    } = this.props;
    const importingCompletedRatio = _.round(importedQuantityTotal * 100 / (importedQuantityTotal + requiredQuantityTotal), 2);
    return (
      <div className="product-statistic__products__statistic__item --importing-statistic">
        <div className="--importing-statistic__header">
          <Tooltip  title="Xem lịch sử nhập hàng" placement="top">
            <Button
              shape="circle"
              icon={<HistoryOutlined />}
              className="--importing-statistic__header__btn-show-history"
            />
          </Tooltip>
          <span className="--importing-statistic__header__title">Thống kê nhập hàng</span>
          <div className="--importing-statistic__header__importing-cost">
            <span>Tổng chi phí đã nhập:</span>
            <NumberFormat
              value={importingCostTotal}
              displayType="text"
              thousandSeparator={true}
              suffix=" đ̲"
              className="--importing-statistic__header__importing-cost__number"
            />
          </div>
          <div className="--importing-statistic__header__importing-cost">
            <span>Tổng chi phí dự kiến:</span>
            <NumberFormat
              value={requiredImportingCostTotal}
              displayType="text"
              thousandSeparator={true}
              suffix=" đ̲"
              className="--importing-statistic__header__importing-cost__number"
            />
          </div>
        </div>

        <div className="--importing-statistic__progress-wrapper">
          <Progress
            type="circle"
            strokeColor={importingCompletedRatio < 100 ? {
              '0%': '#f09819',
              '100%': '#ff5858',
            } : ''}
            percent={importingCompletedRatio}
            format={percent => (
              <div className="--importing-statistic__progress-wrapper__progress-inner">
                <span className="--importing-statistic__progress-wrapper__progress-inner__value">
                  {importedQuantityTotal}/{requiredQuantityTotal}
                </span>
                <span className="--importing-statistic__progress-wrapper__progress-inner__label">
                  Sản phẩm
                </span>
              </div>
            )}
          />
        </div>
        <div className="--importing-statistic__footer">
          <Row style={{ width: '100%', height: '100%' }} justify="center">
            <Col span={12}>
              <div className="--importing-statistic__footer__col">
                <span className="--importing-statistic__footer__col__value">
                  {importedQuantityTotal}
                </span>
                <span className="--importing-statistic__footer__col__label">
                  Sản phẩm đã nhập
                </span>
              </div>
            </Col>
            <Col span={12}>
              <div className="--importing-statistic__footer__col">
                <span className="--importing-statistic__footer__col__value">
                  {requiredQuantityTotal - importedQuantityTotal}
                </span>
                <span className="--importing-statistic__footer__col__label">
                  Sản phẩm chờ nhập
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
