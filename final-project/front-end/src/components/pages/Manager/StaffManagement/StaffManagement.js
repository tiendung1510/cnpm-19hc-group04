import React from 'react';
import PageBase from '../../../utilities/PageBase/PageBase';
import './StaffManagement.style.scss';
import { SearchOutlined, TeamOutlined, EditOutlined, UserDeleteOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Row, Col, Select, Table, Button, Avatar, Tooltip, message } from 'antd';
import { withCookies } from 'react-cookie';
import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import { API } from '../../../../constants/api.constant';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/actions';
import moment from 'moment';
import USER_ROLES from '../../../../constants/user-role.constant';

const { Option } = Select;

class StaffManagement extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      staffs: [],
      selectedStaff: null
    }
  }

  componentDidMount() {
    this.loadStaffs();
  }

  loadStaffs = async () => {
    this.props.setAppLoading(true);
    const res = await (
      await fetch(
        API.Manager.StaffManagement.getListStaffs,
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

    if (res.status === 200) {
      const { users } = res.data;
      this.setState({ staffs: users });
    } else {
      message.error(res.errors[0]);
    }

    this.props.setAppLoading(false);
  }

  onClickListStaffsRow(record) {
    this.setState({ selectedStaff: record });
  }

  render() {
    let { staffs, selectedStaff } = this.state;
    staffs = staffs
      .filter(s => s.role !== USER_ROLES.MANAGER.type)
      .map((s, i) => {
        let staff = JSON.parse(JSON.stringify(s));
        staff.key = i;
        return staff;
      });

    let columns;
    if (staffs.length === 0) {
      columns = [];
      selectedStaff = null;
    } else {
      if (!selectedStaff) {
        selectedStaff = staffs[0];
      }

      columns = Object.keys(staffs[0]).filter(k => !['_id', 'avatar', 'updatedAt', '__v', 'key', 'role'].includes(k));
      columns = columns.map(k => {
        let title, colIndex;
        switch (k) {
          case 'fullname': title = 'Họ & tên'; colIndex = 0; break;
          // case 'role': title = 'Loại NV'; colIndex = 1; break;
          case 'dateOfBirth': title = 'Ngày sinh'; colIndex = 2; break;
          case 'sex': title = 'Giới tính'; colIndex = 3; break;
          case 'email': title = 'Email'; colIndex = 4; break;
          case 'phone': title = 'Điện thoại'; colIndex = 5; break;
          case 'address': title = 'Địa chỉ'; colIndex = 6; break;
          case 'salaryRate': title = 'HS lương'; colIndex = 7; break;
          case 'createdAt': title = 'Ngày tham gia'; colIndex = 8; break;
          default: break;
        }

        let column = {
          title,
          colIndex,
          dataIndex: k,
          width: 100
        }

        if (k === 'fullname') {
          column.render = (text, record) => (
            <Row align="middle" style={{ width: '100%' }}>
              <Col span={6}><Avatar src={record.avatar} size={24} /></Col>
              <Col span={18}><span style={{ fontWeight: 'bold' }}>{text}</span></Col>
            </Row>
          );
          column.width = 130;
        }

        if (k === 'address') {
          column.width = 150;
        }

        if (k === 'email') {
          column.width = 130;
        }

        if (k === 'sex' || k === 'salaryRate' || k === 'dateOfBirth') {
          column.width = 80;
        }

        if (k === 'createdAt') {
          column.render = text => moment(text).format('DD-MM-YYYY HH:mm');
        }

        return column;
      });

      columns.sort((a, b) => a.colIndex - b.colIndex);
    }

    return (
      <div className="staff-management animated fadeIn">
        <div className="staff-management__body">
          <Row className="staff-management__body__staffs">
            <Col span={4}>
              <div className="staff-management__body__staffs__sidebar">
                <div className="staff-management__body__staffs__sidebar__staff-details">
                  <Avatar
                    className="staff-management__body__staffs__sidebar__staff-details__avatar"
                    size={50}
                    src={selectedStaff ? selectedStaff.avatar : 'https://cdn.wrytin.com/images/avatar/s/256/default.jpeg'} />
                  <div className="staff-management__body__staffs__sidebar__staff-details__basic-info">
                    <div className="staff-management__body__staffs__sidebar__staff-details__basic-info__name">
                      <span>{selectedStaff ? selectedStaff.fullname : ''}</span>
                    </div>
                    <div className="staff-management__body__staffs__sidebar__staff-details__basic-info__role">
                      <span>{selectedStaff ? USER_ROLES[selectedStaff.role].name : ''}</span>
                    </div>
                  </div>
                </div>

                <ul className="staff-management__body__staffs__sidebar__staff-features">
                  <li className="staff-management__body__staffs__sidebar__staff-features__feature">
                    <Row align="middle">
                      <Col span={2}>
                        <EditOutlined className="staff-management__body__staffs__sidebar__staff-features__feature__icon" />
                      </Col>
                      <Col span={22} className="staff-management__body__staffs__sidebar__staff-features__feature__info">
                        <span className="staff-management__body__staffs__sidebar__staff-features__feature__info__name">
                          Chỉnh sửa thông tin</span>
                      </Col>
                    </Row>
                  </li>
                  <li className="staff-management__body__staffs__sidebar__staff-features__feature">
                    <Row align="middle">
                      <Col span={2}>
                        <CalendarOutlined className="staff-management__body__staffs__sidebar__staff-features__feature__icon" />
                      </Col>
                      <Col span={22} className="staff-management__body__staffs__sidebar__staff-features__feature__info">
                        <span className="staff-management__body__staffs__sidebar__staff-features__feature__info__name">
                          In lịch làm việc trong tuần</span>
                      </Col>
                    </Row>
                  </li>
                  <li className="staff-management__body__staffs__sidebar__staff-features__feature">
                    <Row align="middle">
                      <Col span={2}>
                        <UserDeleteOutlined className="staff-management__body__staffs__sidebar__staff-features__feature__icon" />
                      </Col>
                      <Col span={22} className="staff-management__body__staffs__sidebar__staff-features__feature__info">
                        <span className="staff-management__body__staffs__sidebar__staff-features__feature__info__name">
                          Xóa khỏi hệ thống</span>
                      </Col>
                    </Row>
                  </li>
                </ul>

              </div>
            </Col>
            <Col span={20}>
              <div className="staff-management__body__staffs__content">
                <div className="staff-management__body__staffs__content__toolbar">
                  <Row style={{ width: '100%' }} align="middle">
                    <Col span={18}>
                      <div className="staff-management__body__staffs__content__toolbar__title">
                        <TeamOutlined className="staff-management__body__staffs__content__toolbar__title__icon" />
                        <span className="staff-management__body__staffs__content__toolbar__title__text">
                          Nhân viên:
                          <span
                            className="staff-management__body__staffs__content__toolbar__title__text__staff-total">
                            {staffs.length}
                          </span>
                        </span>
                      </div>
                    </Col>
                    <Col span={6}>
                      <Input prefix={<SearchOutlined style={{ marginRight: 5 }} />} placeholder="Tìm kiếm nhân viên..." />
                    </Col>
                  </Row>
                </div>
                <div className="staff-management__body__staffs__content__list-staffs">
                  <div className="staff-management__body__staffs__content__list-staffs__header">
                    <div className="staff-management__body__staffs__content__list-staffs__header__dark-bg"></div>
                    <Row>
                      <Col span={6} >
                        <div className="staff-management__body__staffs__content__list-staffs__header__role-selection">
                          <Select defaultValue="CASHIER" style={{ width: 220 }}>
                            <Option value="CASHIER">Nhân viên thu ngân</Option>
                            <Option value="IMPORTER">Nhân viên nhập hàng</Option>
                          </Select>
                        </div>
                      </Col>
                      <Col span={18}>
                        <div className="staff-management__body__staffs__content__list-staffs__header__buttons">
                          <Tooltip placement="bottom" title="Thêm nhân viên">
                            <Button shape="circle" type="link" icon={<PlusOutlined />} />
                          </Tooltip>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Row className="staff-management__body__staffs__content__list-staffs__wrapper">
                    <Table
                      columns={columns}
                      dataSource={staffs}
                      pagination={{ pageSize: 50 }}
                      scroll={{ y: 340 }}
                      onRow={(record) => {
                        return {
                          onClick: () => this.onClickListStaffsRow(record)
                        }
                      }}
                      rowClassName={record => record._id === selectedStaff._id ?
                        'staff-management__body__staffs__content__list-staffs__selected-row' : ''}
                    />
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
export default connect(null, actions)(withCookies(StaffManagement));
