import React, { Component } from 'react';
import './ReportToPrint.style.scss';

export default class ReportToPrint extends Component {
  render() {
    return (
      <div className="reporting__report-to-print__content">
        <div className="reporting__report-to-print__content__header">
          <div className="reporting__report-to-print__content__header__company">
            <img
              className="reporting__report-to-print__content__header__company__logo"
              src={require('../../../../../assets/images/app-logo.png')} alt="logo" />
            <div className="reporting__report-to-print__content__header__company__brand">
              <div className="reporting__report-to-print__content__header__company__brand__name">
                <span>Mini Mart</span>
              </div>
              <div className="reporting__report-to-print__content__header__company__brand__slogan">
                <span>Tiện Lợi mà Chất Lượng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
