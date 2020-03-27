import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Row, Col, Table } from 'antd';
import './WorkScheduleReportToPrint.style.scss';
import USER_ROLES from '../../../../../../constants/user-role.constant';
import moment from 'moment';
import { COOKIE_NAMES } from '../../../../../../constants/cookie-name.constant';

const dataSource = [
  {
    monday: [
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      }
    ],
    tuesday: [
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      }
    ],
    wednesday: [
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      }
    ],
    thursday: [
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      }
    ],
    friday: [
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      }
    ],
    saturday: [
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      }
    ],
    sunday: [
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      },
      {
        startTime: moment(new Date()).format('HH:mm'),
        endTime: moment(new Date()).format('HH:mm')
      }
    ]
  }
];

const columns = [
  {
    title: record => {
      const date = new Date();
      return `Thứ 2 (${date.getDate()}/${date.getMonth()})`;
    },
    dataIndex: 'monday',
    key: 'monday',
    render: data => (
      <ul>{data.map(item => (
        <li><span>{`${item.startTime} - ${item.endTime}`}</span></li>
      ))}</ul>
    )
  },
  {
    title: record => {
      const date = new Date();
      return `Thứ 3 (${date.getDate()}/${date.getMonth()})`;
    },
    dataIndex: 'tuesday',
    key: 'tuesday',
    render: data => (
      <ul>{data.map(item => (
        <li><span>{`${item.startTime} - ${item.endTime}`}</span></li>
      ))}</ul>
    )
  },
  {
    title: record => {
      const date = new Date();
      return `Thứ 4 (${date.getDate()}/${date.getMonth()})`;
    },
    dataIndex: 'wednesday',
    key: 'wednesday',
    render: data => (
      <ul>{data.map(item => (
        <li><span>{`${item.startTime} - ${item.endTime}`}</span></li>
      ))}</ul>
    )
  },
  {
    title: record => {
      const date = new Date();
      return `Thứ 5 (${date.getDate()}/${date.getMonth()})`;
    },
    dataIndex: 'thursday',
    key: 'thursday',
    render: data => (
      <ul>{data.map(item => (
        <li><span>{`${item.startTime} - ${item.endTime}`}</span></li>
      ))}</ul>
    )
  },
  {
    title: record => {
      const date = new Date();
      return `Thứ 6 (${date.getDate()}/${date.getMonth()})`;
    },
    dataIndex: 'friday',
    key: 'friday',
    render: data => (
      <ul>{data.map(item => (
        <li><span>{`${item.startTime} - ${item.endTime}`}</span></li>
      ))}</ul>
    )
  },
  {
    title: record => {
      const date = new Date();
      return `Thứ 7 (${date.getDate()}/${date.getMonth()})`;
    },
    dataIndex: 'saturday',
    key: 'saturday',
    render: data => (
      <ul>{data.map(item => (
        <li><span>{`${item.startTime} - ${item.endTime}`}</span></li>
      ))}</ul>
    )
  },
  {
    title: record => {
      const date = new Date();
      return `Chủ nhật (${date.getDate()}/${date.getMonth()})`;
    },
    dataIndex: 'sunday',
    key: 'sunday',
    render: data => (
      <ul>{data.map(item => (
        <li><span>{`${item.startTime} - ${item.endTime}`}</span></li>
      ))}</ul>
    )
  }
];

class WorkScheduleReportToPrint extends Component {
  render() {
    const manager = this.props.cookies.get(COOKIE_NAMES.user);
    let { staff } = this.props;

    if (!staff)
      return <></>;

    return (
      <div className="work-schedule-report-to-print">

        <div className="work-schedule-report-to-print__header">
          <div className="work-schedule-report-to-print__header__company">
            <img
              className="work-schedule-report-to-print__header__company__logo"
              src={require('../../../../../../assets/images/app-logo.png')} alt="logo" />
            <div className="work-schedule-report-to-print__header__company__brand">
              <div className="work-schedule-report-to-print__header__company__brand__name">
                <span>Mini Mart</span>
              </div>
              <div className="work-schedule-report-to-print__header__company__brand__slogan">
                <span>Tiện Lợi mà Chất Lượng</span>
              </div>
            </div>
          </div>

          <div className="work-schedule-report-to-print__header__created-date">
            <span>{moment().format('DD/MM/YYYY HH:mm')}</span>
          </div>

          <div className="work-schedule-report-to-print__header__title">
            <h2>Lịch làm việc trong tuần</h2>
            <span className="work-schedule-report-to-print__header__title__date-range">
              (Từ ngày 21/03/2020 đến ngày 27/03/2020)
            </span>
          </div>
        </div>

        <div className="work-schedule-report-to-print__content">
          <div className="work-schedule-report-to-print__content__staff-info">
            <h3>Thông tin nhân viên</h3>
            <Row
              style={{ width: '100%' }}
              gutter={10}
              className="work-schedule-report-to-print__content__staff-info__item"
            >
              <Col span={7} style={{ fontWeight: 'bold' }}>Họ và tên</Col>
              <Col span={17} style={{ fontWeight: 'bold', fontSize: 14 }}>{staff.fullname}</Col>
            </Row>
            <Row
              style={{ width: '100%' }}
              gutter={10}
              className="work-schedule-report-to-print__content__staff-info__item"
            >
              <Col span={7} style={{ fontWeight: 'bold' }}>Ngày sinh</Col>
              <Col span={17}>{staff.dateOfBirth}</Col>
            </Row>
            <Row
              style={{ width: '100%' }}
              gutter={10}
              className="work-schedule-report-to-print__content__staff-info__item"
            >
              <Col span={7} style={{ fontWeight: 'bold' }}>Chức vụ</Col>
              <Col span={17}>{USER_ROLES[staff.role].name}</Col>
            </Row>
          </div>

          <div className="work-schedule-report-to-print__content__work-schedule">
            <h3>Ca được phân công</h3>

            <Table
              bordered
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className="work-schedule-report-to-print__content__work-schedule__table"
            />

          </div>

          <Row justify="center" align="middle"
            className="work-schedule-report-to-print__content__manager-confirm">
            <Col span={14}></Col>
            <Col span={10} align="middle">
              <span className="work-schedule-report-to-print__content__manager-confirm__stand-for">TM. Người quản lý</span>
              <div className="work-schedule-report-to-print__content__manager-confirm__signature">
                <img src="https://files.slack.com/files-pri/THXMMTH2T-F010LJC6MAP/signature.png" alt="signature" />
              </div>
              <span className="work-schedule-report-to-print__content__manager-confirm__fullname">{manager.fullname}</span>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}
export default withCookies(WorkScheduleReportToPrint);