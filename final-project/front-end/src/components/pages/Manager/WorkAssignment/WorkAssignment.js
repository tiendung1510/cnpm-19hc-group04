import React from 'react';
import { Row, Col, Tabs, Select, List, Avatar, Button, Tooltip } from 'antd';
import { PlusCircleOutlined, UsergroupAddOutlined, MoreOutlined, CloseCircleOutlined } from '@ant-design/icons';
import USER_ROLE from '../../../../constants/user-role.constant';
import './WorkAssignment.style.scss';
import * as monent from 'moment';
import * as _ from 'lodash';
import WEEK_DAY from '../../../../constants/week-day.constant';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/actions';
import { API } from '../../../../constants/api.constant';
import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import PageBase from '../../../utilities/PageBase/PageBase';

const { TabPane } = Tabs;
const { Option } = Select;

class WorkAssignment extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      selectedWorkSchedule: {
        index: 0,
        workDays: []
      },
      selectedWorkDay: {},
      selectedWorkShift: {},
      workSchedules: []
    }
  }

  componentDidMount() {
    this.loadWorkSchedules();
  }

  loadWorkSchedules = async () => {
    this.props.setAppLoading(true);
    const res = await (await fetch(
      API.Manager.getWorkSchedules,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'token': this.props.cookies.get(COOKIE_NAMES.token)
        },
        signal: this.abortController.signal
      }
    )).json();

    this.props.setAppLoading(false);
    const _workSchedules = res.data.workSchedules;
    let { selectedWorkSchedule, workSchedules } = this.state;
    selectedWorkSchedule = { ...selectedWorkSchedule, ..._workSchedules[0] };
    workSchedules = [..._workSchedules];
    this.setState({ selectedWorkSchedule, workSchedules });

    for (let i = 0; i < selectedWorkSchedule.workDays.length; i++) {
      for (let j = 0; j < selectedWorkSchedule.workDays[i].length; j++) {
        if (selectedWorkSchedule.workDays[i][j].staffs.length > 0) {
          const selectedWorkDay = selectedWorkSchedule.workDays[i][j];
          let selectedWorkShift = selectedWorkDay.workShifts[0];
          selectedWorkShift.index = 0;
          this.setState({ selectedWorkDay, selectedWorkShift })
          break;
        }
      }
    }
  }

  toggleTaskWorkDayPanel() {
    const { isTaskWorkDayPanelShown } = this.state;
    this.setState({ isTaskWorkDayPanelShown: !isTaskWorkDayPanelShown });
  }

  filterWorkShiftsByDay(workShifts, day) {
    return workShifts.filter(ws => {
      const wsDay = new Date(ws.startTime).getDate();
      return day === wsDay;
    });
  }

  generateWorkDays(workSchedule) {
    const { month, year, workShifts } = workSchedule;
    const workDaysLength = monent(`${month}-${year}`, 'M-YYYY').daysInMonth();
    let workDays = [];
    let temp = [];
    let assigners = [];

    for (let i = 1; i <= workDaysLength; i++) {
      assigners.length = 0;
      assigners = [];

      const filteredWorkShifts = this.filterWorkShiftsByDay(workShifts, i);
      for (const ws of filteredWorkShifts) {
        for (const wa of ws.workAssignments)
          assigners.push(wa.assigner);
      }

      assigners = _.uniqBy(assigners, a => a._id);
      temp.push({
        workWeekDay: this.getWeekDay(i, month, year),
        workDayInMonth: i,
        workMonth: month,
        workYear: year,
        staffs: [...assigners],
        workShifts: [...filteredWorkShifts]
      });

      if (i % 7 === 0) {
        workDays.push([...temp]);
        temp.length = 0;
      }
    }

    temp.length = 0;
    temp = [];

    for (let i = 29; i <= workDaysLength; i++) {
      assigners = [];

      const filteredWorkShifts = this.filterWorkShiftsByDay(workShifts, i);
      for (const ws of filteredWorkShifts) {
        for (const wa of ws.workAssignments)
          assigners.push(wa.assigner);
      }

      assigners = _.uniqBy(assigners, a => a._id);
      temp.push({
        workWeekDay: this.getWeekDay(i, month, year),
        workDayInMonth: i,
        workMonth: month,
        workYear: year,
        staffs: [...assigners],
        workShifts: [...filteredWorkShifts]
      });
    }
    workDays.push([...temp]);

    return workDays;
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
    const { workSchedules } = this.state;
    return _.uniqBy(workSchedules, w => w.year).map(w => ({ text: 'Năm ' + w.year, value: w.year }));
  }

  handleSelectWorkSchedule(selectedWorkSchedule, index) {
    selectedWorkSchedule.index = index;
    selectedWorkSchedule.workDays = this.generateWorkDays(selectedWorkSchedule);

    for (let i = 0; i < selectedWorkSchedule.workDays.length; i++) {
      for (let j = 0; j < selectedWorkSchedule.workDays[i].length; j++) {
        if (selectedWorkSchedule.workDays[i][j].staffs.length > 0) {
          let { selectedWorkShift } = this.state;
          const selectedWorkDay = selectedWorkSchedule.workDays[i][j];

          if (selectedWorkDay.workShifts.length > 0) {
            selectedWorkShift = selectedWorkDay.workShifts[0];
            selectedWorkShift.index = 0;
          } else {
            selectedWorkShift = {}
          }

          this.setState({
            selectedWorkDay,
            selectedWorkShift
          });

          break;
        }
      }
    }

    this.setState({ selectedWorkSchedule });
  }

  handleSelectWorkDay(row, col) {
    const { selectedWorkSchedule } = this.state;
    let { selectedWorkShift } = this.state;
    const selectedWorkDay = selectedWorkSchedule.workDays[row][col];

    if (selectedWorkDay.workShifts.length > 0) {
      selectedWorkShift = selectedWorkDay.workShifts[0];
      selectedWorkShift.index = 0;
    } else {
      selectedWorkShift = {}
    }

    this.setState({
      selectedWorkDay,
      selectedWorkShift
    });
  }

  handleSelectWorkShift(workShift, index) {
    workShift.index = index;
    this.setState({ selectedWorkShift: workShift });
  }

  render() {
    let { workSchedules, selectedWorkSchedule, selectedWorkDay, selectedWorkShift } = this.state;
    selectedWorkSchedule.workDays = this.generateWorkDays(selectedWorkSchedule);
    const listYears = this.getListYears();

    return (
      <div className="work-assignment">
        <Row>
          <Col className="work-assignment__left-sidebar" span={4}>
            <div>
              <Button
                className="work-assignment__left-sidebar__btn-add-work-schedule"
                icon={<PlusCircleOutlined />}>Thêm lịch làm việc</Button>

              <div className="work-assignment__left-sidebar__year-selection">
                <div className="work-assignment__left-sidebar__title">
                  <span>Năm làm việc</span>
                </div>
                <div>
                  {
                    (listYears || []).length > 0 ? (
                      <Select defaultValue={listYears[0].value} onChange={e => console.log(e)}>
                        {listYears.map((y, i) => (
                          <Option key={i} value={y.value}>{y.text}</Option>
                        ))}
                      </Select>
                    ) : <></>
                  }
                </div>
              </div>

              <div className="work-assignment__left-sidebar__list-tasks">

                <div className="work-assignment__left-sidebar__title">
                  <span>Tháng làm việc</span>
                </div>

                <div className="work-assignment__left-sidebar__list-tasks__wrapper">
                  <List
                    size="small"
                    dataSource={workSchedules}
                    renderItem={(item, index) => {
                      return (
                        <List.Item
                          className={
                            `work-assignment__left-sidebar__list-tasks__item animated fadeIn
                          ${index === selectedWorkSchedule.index ? 'work-assignment__left-sidebar__list-tasks__item--selected' : ''}`
                          }
                          onClick={() => this.handleSelectWorkSchedule(item, index)}>
                          <Row>
                            <Col span={24}>
                              <span className="work-assignment__left-sidebar__list-tasks__item__task-name">Tháng {item.month}</span>
                            </Col>
                          </Row>
                        </List.Item>
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col className="work-assignment__content" span={20}>
            <div className="work-assignment__content__task-work-day-panel">
              <div className="work-assignment__content__task-work-day-panel__panel">

                <div className="work-assignment__content__task-work-day-panel__panel__main">
                  <h3>{
                    `${selectedWorkDay.workWeekDay ? selectedWorkDay.workWeekDay + ', ' : ''} ${selectedWorkDay.workYear ? monent(new Date(selectedWorkDay.workYear, selectedWorkDay.workMonth - 1, selectedWorkDay.workDayInMonth)).format('DD/MM/YYYY') : ''}`
                  }</h3>

                  <div
                    className="work-assignment__content__task-work-day-panel__panel__main__list-staffs work-assignment__content__task-work-day-panel__panel__main__list-work-shifts">
                    <Row>
                      <Col span={21}>
                        <span className="work-assignment__content__task-work-day-panel__panel__main__title">
                          Ca làm việc trong ngày</span>
                      </Col>
                      <Col span={3}>
                        <Tooltip placement="bottom" title="Thêm ca làm việc">
                          <Button
                            className="work-assignment__content__task-work-day-panel__panel__btn-open-list-staffs"
                            type="link"
                            icon={<PlusCircleOutlined />} />
                        </Tooltip>
                      </Col>
                    </Row>
                    <div className="work-assignment__content__task-work-day-panel__panel__main__list-work-shifts__wrapper">
                      <List
                        itemLayout="horizontal"
                        dataSource={selectedWorkDay.workShifts}
                        renderItem={(ws, index) => (
                          <List.Item onClick={() => this.handleSelectWorkShift(ws, index)}>
                            <Row
                              className={`
                                animated fadeIn
                                ${index === selectedWorkShift.index ?
                                  'work-assignment__content__task-work-day-panel__panel__main__list-work-shifts__item--selected'
                                  : 'work-assignment__content__task-work-day-panel__panel__main__list-work-shifts__item'}`}
                            >
                              <Col span={22}>
                                <span>
                                  Từ {monent(ws.startTime).format('HH:mm')} đến {monent(ws.endTime).format('HH:mm')}
                                </span>
                              </Col>
                              <Col span={2}>
                                <Button
                                  className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__btn-close"
                                  type="link"
                                  icon={<CloseCircleOutlined />} />
                              </Col>
                            </Row>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>

                  <div className="work-assignment__content__task-work-day-panel__panel__main__list-work-shifts__details">
                    <h3>Chi tiết ca làm việc</h3>
                    <Row>
                      <Col span={8}>
                        <ul
                          className="work-assignment__content__task-work-day-panel__panel__main__list-work-shifts__time--label">
                          <li>Bắt đầu</li>
                          <li>Kết thúc</li>
                        </ul>
                      </Col>
                      <Col span={16}>
                        <ul
                          className="work-assignment__content__task-work-day-panel__panel__main__list-work-shifts__time--value">
                          <li>{
                            selectedWorkShift.startTime ? monent(selectedWorkShift.startTime).format('HH:mm') : ''
                          }</li>
                          <li>{
                            selectedWorkShift.endTime ? monent(selectedWorkShift.endTime).format('HH:mm') : ''
                          }</li>
                        </ul>
                      </Col>
                    </Row>
                    <div className="work-assignment__content__task-work-day-panel__panel__main__list-staffs">
                      <Row>
                        <Col span={21}>
                          <span className="work-assignment__content__task-work-day-panel__panel__main__title">
                            Nhân viên phụ trách ({
                              selectedWorkShift.workAssignments ? selectedWorkShift.workAssignments.length : 0
                            })</span>
                        </Col>
                        <Col span={3}>
                          <Tooltip placement="bottom" title="Thêm nhân viên">
                            <Button
                              className="work-assignment__content__task-work-day-panel__panel__btn-open-list-staffs"
                              type="link"
                              icon={<UsergroupAddOutlined />} />
                          </Tooltip>
                        </Col>
                      </Row>

                      <div className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__wrapper">
                        <List
                          itemLayout="horizontal"
                          dataSource={selectedWorkShift.workAssignments}
                          renderItem={wa => (
                            <List.Item>
                              <div className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__staff animated fadeIn">
                                <Row style={{ width: '100%' }}>
                                  <Col span={22}>
                                    <List.Item.Meta
                                      avatar={<Avatar src={wa.assigner.avatar} />}
                                      title={<span>{wa.assigner.fullname}</span>}
                                      description={USER_ROLE[wa.assigner.role].name}
                                    />
                                  </Col>
                                  <Col span={2}>
                                    <Button
                                      className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__btn-more"
                                      type="link"
                                      icon={<MoreOutlined />} />
                                  </Col>
                                </Row>
                                <p className="work-assignment__content__task-work-day-panel__panel__main__list-staffs__note">
                                  {wa.description}
                                </p>
                              </div>
                            </List.Item>
                          )}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="work-assignment__content__header">
              <div className="work-assignment__content__header__dark-bg"></div>
              <div className="work-assignment__content__header__task-name">
                <h3>Tháng {selectedWorkSchedule.month} năm {selectedWorkSchedule.year}</h3>
              </div>
            </div>
            <div className="work-assignment__content__body">
              <Tabs
                defaultActiveKey="1"
                tabBarGutter={50}
                className="work-assignment__content__body__tabs"
                onChange={e => console.log(e)}>
                <TabPane tab="Lịch làm việc" key="1" className="work-assignment__content__body__tabs__work-schedule">
                  {selectedWorkSchedule.workDays.map((row, iRow) => (
                    <Row key={iRow + 1}>
                      {row.map((col, iCol) => (
                        <Col key={`${iRow + 1}_${iCol}`} span={2}
                          className={`
                            animated fadeIn
                            work-assignment__content__body__tabs__work-schedule__work-day 
                            ${col.workDayInMonth === selectedWorkDay.workDayInMonth ?
                              'work-assignment__content__body__tabs__work-schedule__work-day--selected' : ''
                            }
                          `}
                          onClick={() => this.handleSelectWorkDay(iRow, iCol)}>
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
                          <div className="work-assignment__content__body__tabs__work-schedule__work-day__staffs">
                            {col.staffs.slice(0, 2).map(staff => (
                              <Avatar
                                key={staff._id}
                                size={16}
                                className="work-assignment__content__body__tabs__work-schedule__work-day__staffs__avatar"
                                src={staff.avatar} />))}
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
                <TabPane tab="Đã phân công (3)" key="2">
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
export default connect(null, actions)(withCookies(WorkAssignment));
