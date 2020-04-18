import React from 'react';
import { DatePicker } from 'antd';
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
        <div className="reporting__date-picker">
          <span className="reporting__date-picker__label">Tháng:</span>
          <DatePicker
            defaultValue={moment(`${month}/${year}`, 'MM/YYYY')}
            format={'MM/YYYY'}
            picker="month"
            size="small"
            clearIcon={null}
            placeholder="Chọn tháng"
            bordered={false}
            monthCellRender={date => this.monthCellRender(date)}
            onChange={e => this.onDatePickerChange(e)}
          />
        </div>

        <RevenueStatistic
          month={month}
          year={year}
        />

        <div className="reporting__block-style" style={{ height: 500 }}></div>

      </div>
    )
  }
}
export default connect(null, actions)(withCookies(Reporting));