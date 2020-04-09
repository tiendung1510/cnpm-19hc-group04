import React, { Component } from 'react';
import { Row, Col } from 'antd';
import './ImportingRequest.style.scss';
import SupplierManagement from './SupplierManagement/SupplierManagement';

export default class ImportingRequest extends Component {
  render() {
    return (
      <div className="importing-request animated fadeIn">
        <div className="importing-request__container">
          <Row gutter={10} style={{ width: '100%', height: '100%', margin: 0 }}>
            <Col span={5}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --to-do">
                    Đang chờ duyệt
                  </span>
                  <span className="importing-request__container__block__header__number --to-do">
                    5
                  </span>
                </div>
                <div className="importing-request__container__block__body">
                  <div className="importing-request__container__block__body__request"></div>
                  <div className="importing-request__container__block__body__request"></div>
                  <div className="importing-request__container__block__body__request"></div>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --progressing">
                    Đang thực hiện
                  </span>
                  <span className="importing-request__container__block__header__number --progressing">
                    5
                  </span>
                </div>
                <div className="importing-request__container__block__body"></div>
              </div>
            </Col>
            <Col span={5}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --done">
                    Đã hoàn tất
                  </span>
                  <span className="importing-request__container__block__header__number --done">
                    5
                  </span>
                </div>
                <div className="importing-request__container__block__body"></div>
              </div>
            </Col>
            <Col span={9}>
              <SupplierManagement />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
