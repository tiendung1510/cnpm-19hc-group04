import React, { Component } from 'react';
import { Row, Col, Tabs, Select, Input, List, Avatar, Button, Progress, Tooltip } from 'antd';
import { SearchOutlined, PlusCircleOutlined, CloseOutlined, LogoutOutlined, EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import USER_ROLE from '../../../../constants/user-role.constant';
import './WorkAssignment.style.scss';
import * as monent from 'moment';
import * as _ from 'lodash';
import WEEK_DAY from '../../../../constants/week-day.constant';
import TASK_STATUS from '../../../../constants/task-status.constant';

const { TabPane } = Tabs;
const { Option } = Select;

const tasks = [
  'Công việc 1',
  'Công việc 2',
  'Công việc 3',
  'Công việc 4',
  'Công việc 5',
];

const staffs = [
  {
    _id: 'xxx',
    name: 'Tue Vo',
    role: USER_ROLE.MANAGER.name,
    avatar: 'tue.jpeg'
  },
  {
    _id: 'yyy',
    name: 'Dung Pham',
    role: USER_ROLE.CASHIER.name,
    avatar: 'dung.jpg'
  },
  {
    _id: 'zzz',
    name: 'Binh Nguyen',
    role: USER_ROLE.IMPORTER.name,
    avatar: 'binh.jpg'
  },
];

export default class WorkAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTaskWorkDayPanelShown: false,
      selectedTaskWorkDay: {
        index: 0,
        name: 'Công việc 1',
        workDayInMonth: 'Chủ nhật, 01/03/2020',
        staffs: staffs.map((staff, index) => {
          const o = JSON.parse(JSON.stringify(staff));
          const status = index % 2 === 0 ? TASK_STATUS.DONE.value : TASK_STATUS.NOT_YET.value;
          o.status = status;
          return o;
        }),
        note: 'Ghi chú tại đây.'
      },
      selectedTask: {
        index: 0,
        name: tasks[0],
        workDays: [...this.createSchedule(3, 2020)]
      }
    }
  }

  toggleTaskWorkDayPanel() {
    const { isTaskWorkDayPanelShown } = this.state;
    this.setState({ isTaskWorkDayPanelShown: !isTaskWorkDayPanelShown });
  }

  createSchedule(month, year) {
    const workDays = monent(`${month}-${year}`, 'MM-YYYY').daysInMonth();
    let schedule = [];
    let temp = [];
    for (let i = 1; i <= workDays; i++) {
      if (i % 7 !== 0) {
        temp.push({
          workDayInMonth: i,
          workWeekDay: this.getWeekDay(i, month, year),
          staffs: [...staffs],
          note: 'Ghi chú tại đây.'
        });
      } else {
        temp.push({
          workDayInMonth: i,
          workWeekDay: this.getWeekDay(i, month, year),
          staffs: [...staffs],
          note: 'Ghi chú tại đây.'
        });
        schedule.push([...temp]);
        temp.length = 0;
      }
    }

    temp.length = 0;
    for (let i = 29; i <= workDays; i++) {
      temp.push({
        workDayInMonth: i,
        workWeekDay: this.getWeekDay(i, month, year),
        staffs: [...staffs],
        note: 'Ghi chú tại đây.'
      });
    }
    schedule.push([...temp]);
    temp.length = 0;

    return schedule;
  }

  getWeekDay(day, month, year) {
    const weekDayNumber = monent(`${day}-${month}-${year}`, 'DD-MM-YYYY').day();
    switch (weekDayNumber) {
      case 1: return WEEK_DAY.MONDAY;
      case 2: return WEEK_DAY.TUESDAY;
      case 3: return WEEK_DAY.WEDNESDAY;
      case 4: return WEEK_DAY.THURSDAY;
      case 5: return WEEK_DAY.FRIDAY;
      case 6: return WEEK_DAY.SATURDAY;
      case 0: return WEEK_DAY.SUNDAY;
      default: return null
    }
  }

  calculateTotalDoneDate(staffs) {
    const notYet = _.countBy(staffs, s => s.status === TASK_STATUS.NOT_YET.value).false;
    return Math.round(100 - (100 / staffs.length) * (staffs.length - notYet));
  }

  getListMonths() {
    let months = [];
    for (let i = 1; i <= 12; i++)
      months.push({
        text: 'Tháng ' + i,
        value: i
      });
    return months;
  }

  getListYears() {
    let years = [];
    for (let i = 2020; i <= 2022; i++)
      years.push({
        text: 'Năm ' + i,
        value: i
      });
    return years;
  }

  handleSelectTask(name, index) {
    const selectedTask = { ...this.state.selectedTask };
    selectedTask.name = name;
    selectedTask.index = index;
    this.setState({ selectedTask });
  }

  render() {
    let { isTaskWorkDayPanelShown, selectedTaskWorkDay, selectedTask } = this.state;

    const listMonths = this.getListMonths();
    const listYears = this.getListYears();

    return (
      <div className="work-assignment">
        <Row>
          <Col className="work-assignment__left-sidebar animated fadeInLeft" span={4}>
            <Select defaultValue={listMonths[0].value} onChange={e => console.log(e)}>
              {listMonths.map((m, i) => (
                <Option key={i} value={m.value}>{m.text}</Option>
              ))}
            </Select>
            <Select defaultValue={listYears[0].value} onChange={e => console.log(e)}>
              {listYears.map((y, i) => (
                <Option key={i} value={y.value}>{y.text}</Option>
              ))}
            </Select>

            <div className="work-assignment__left-sidebar__list-tasks">
              <Button
                className="work-assignment__left-sidebar__list-tasks__btn-add"
                icon={<PlusCircleOutlined />}>Thêm công việc</Button>

              <Input
                className="work-assignment__left-sidebar__input"
                placeholder="Tìm kiếm công việc..."
                prefix={<SearchOutlined />} />
              <List
                size="small"
                bordered
                dataSource={tasks}
                renderItem={(item, index) => {
                  return (
                    <List.Item
                      className={
                        `work-assignment__left-sidebar__list-tasks__item 
                        ${index === selectedTask.index ? 'work-assignment__left-sidebar__list-tasks__item--selected' : ''}`
                      }
                      onClick={() => this.handleSelectTask(item, index)}>
                      <Row>
                        <Col span={24}>
                          <span className="work-assignment__left-sidebar__list-tasks__item__task-name">{item}</span>
                        </Col>
                      </Row>
                    </List.Item>
                  )
                }}
              />
            </div>

          </Col>
          <Col className="work-assignment__content animated animated fadeIn" span={20}>
            {isTaskWorkDayPanelShown ? (
              <div className="work-assignment__content__task-work-day-panel">
                <div className="work-assignment__content__task-work-day-panel__panel animated slideInRight">
                  <Button
                    className="work-assignment__content__task-work-day-panel__panel__btn-close"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => this.toggleTaskWorkDayPanel()} />

                  <div className="work-assignment__content__task-work-day-panel__panel__main">
                    <h3>{selectedTaskWorkDay.name}</h3>
                    <span>{selectedTaskWorkDay.workDayInMonth}</span>

                    <div className="work-assignment__content__task-work-day-panel__panel__main__done-rate">
                      <span className="work-assignment__content__task-work-day-panel__panel__main__title">Mức độ hoàn thành</span>
                      <Progress percent={this.calculateTotalDoneDate(selectedTaskWorkDay.staffs)} />
                    </div>

                    <div className="work-assignment__content__task-work-day-panel__panel__main__list-staffs">
                      <Row>
                        <Col span={22}>
                          <span className="work-assignment__content__task-work-day-panel__panel__main__title">
                            Nhân viên phụ trách ({selectedTaskWorkDay.staffs.length})</span>
                        </Col>
                        <Col span={2}>
                          <Tooltip placement="bottom" title="Thêm nhân viên">
                            <Button
                              className="work-assignment__content__task-work-day-panel__panel__btn-open-list-staffs"
                              type="link"
                              icon={<PlusCircleFilled />} />
                          </Tooltip>
                        </Col>
                      </Row>
                      <Input
                        className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__search-input"
                        placeholder="Tìm kiếm nhân viên..."
                        prefix={<SearchOutlined />} />
                      <List
                        itemLayout="horizontal"
                        dataSource={selectedTaskWorkDay.staffs}
                        renderItem={staff => (
                          <List.Item>
                            <Row style={{ width: '100%' }}>
                              <Col span={16}>
                                <List.Item.Meta
                                  avatar={<Avatar src={require(`../../../../assets/avatars/${staff.avatar}`)} />}
                                  title={<span>{staff.name}</span>}
                                  description={staff.role}
                                />
                              </Col>
                              <Col span={6}>
                                {staff.status === TASK_STATUS.DONE.value ? (
                                  <span
                                    className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__done-status--done">
                                    {TASK_STATUS.DONE.text}
                                  </span>
                                ) : (
                                    <span
                                      className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__done-status--not-yet">
                                      {TASK_STATUS.NOT_YET.text}
                                    </span>
                                  )}
                              </Col>
                              <Col span={2}>
                                <Tooltip placement="bottom" title="Hủy phân công">
                                  <Button
                                    className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__btn-unassign"
                                    type="link"
                                    icon={<LogoutOutlined />} />
                                </Tooltip>
                              </Col>
                            </Row>
                          </List.Item>
                        )}
                      />
                      <div className="work-assignment__content__task-work-day-panel__panel__main__note">
                        <div className="work-assignment__content__task-work-day-panel__panel__main__title">
                          <span>Ghi chú</span>
                          <Tooltip placement="bottom" title="Chỉnh sửa">
                            <Button
                              className="work-assignment__content__btn-edit"
                              type="link"
                              icon={<EditOutlined />} />
                          </Tooltip>
                        </div>
                        <p>{selectedTaskWorkDay.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : <></>}
            <div className="work-assignment__content__header">
              <div className="work-assignment__content__header__task-name">
                <h3>
                  <span>{selectedTask.name}</span>
                  <Tooltip placement="bottom" title="Chỉnh sửa">
                    <Button
                      className="work-assignment__content__btn-edit"
                      type="link"
                      icon={<EditOutlined />} />
                  </Tooltip>
                </h3>
              </div>
              <div className="work-assignment__content__header__task-expiration">
                <span>Tháng 3 năm 2020</span>
              </div>
            </div>
            <div className="work-assignment__content__body">
              <Tabs
                defaultActiveKey="1"
                tabBarGutter={50}
                className="work-assignment__content__body__tabs"
                onChange={e => console.log(e)}>
                <TabPane tab="Lịch làm việc" key="1" className="work-assignment__content__body__tabs__work-schedule">
                  {selectedTask.workDays.map((row, iRow) => (
                    <Row key={iRow + 1}>
                      {row.map((col) => (
                        <Col key={`${iRow + 1}_${col.workDayInMonth}`} span={3}
                          className="work-assignment__content__body__tabs__work-schedule__work-day animated fadeIn"
                          onClick={() => this.toggleTaskWorkDayPanel()}>
                          <span
                            className={`
                              work-assignment__content__body__tabs__work-schedule__work-day__day-in-month
                              ${col.workWeekDay === WEEK_DAY.SUNDAY ? 'work-assignment__content__body__tabs__work-schedule__work-day__day-in-month--sunday' : ''}
                            `}>{col.workDayInMonth}</span>
                          <span
                            className={`
                              work-assignment__content__body__tabs__work-schedule__work-day__week-day
                              ${col.workWeekDay === WEEK_DAY.SUNDAY ? 'work-assignment__content__body__tabs__work-schedule__work-day__week-day--sunday' : ''}
                            `}>{col.workWeekDay}</span>
                          <p className="work-assignment__content__body__tabs__work-schedule__work-day__note">
                            {col.note}
                          </p>
                          <div className="work-assignment__content__body__tabs__work-schedule__work-day__staffs">
                            {col.staffs.slice(0, 2).map(staff => (
                              <Avatar
                                key={staff._id}
                                size={16}
                                className="work-assignment__content__body__tabs__work-schedule__work-day__staffs__avatar"
                                src={require(`../../../../assets/avatars/${staff.avatar}`)} />))}
                            {col.staffs.length > 2 ? (
                              <div className="work-assignment__content__body__tabs__work-schedule__work-day__staffs__avatar--plus">
                                <span>+{col.staffs.slice(2).length}</span>
                              </div>
                            ) : <></>}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ))}
                </TabPane>
                <TabPane tab="Mô tả công việc" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
