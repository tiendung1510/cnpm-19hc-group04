import React from 'react';
import { Row, Col } from 'antd';
import './ImportingRequest.style.scss';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import * as actions from '../../../../redux/actions';
import PageBase from '../../../utilities/PageBase/PageBase';
import { API } from '../../../../constants/api.constant';
import { COOKIE_NAMES } from '../../../../constants/cookie-name.constant';
import SupplierManagement from './SupplierManagement/SupplierManagement';
import PendingRequest from './PendingRequest/PendingRequest';
import { message } from 'antd';
import CONSTANT from '../../../../constants/importing-request.constant';
import USER_ROLES from '../../../../constants/user-role.constant';
import StatisticPendingRequestDialog from './StatisticPendingRequestDialog/StatisticPendingRequestDialog';

class ImportingRequest extends PageBase {

  constructor(props) {
    super(props);
    this.state = {
      staffs: [],
      importingRequests: []
    }
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    this.props.setAppLoading(true);
    try {
      const results = await Promise.all([
        this.loadStaffs(),
        this.loadImportingRequests()
      ]);

      this.props.setAppLoading(false);
      const staffs = results[0];
      const importingRequests = results[1];
      this.setState({
        staffs,
        importingRequests
      });
    } catch (error) {
      if (typeof error === 'string')
        message.error(error);
    }
  }

  async loadStaffs() {
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

    if (res.status !== 200) {
      return Promise.reject(res.errors[0]);
    }

    return Promise.resolve(res.data.users);
  }

  async loadImportingRequests() {
    const res = await (
      await fetch(
        API.Manager.ImportingRequestManagement.getImportingRequest,
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

    if (res.status !== 200) {
      return Promise.reject(res.errors[0]);
    }

    return Promise.resolve(res.data.importingRequests);
  }

  getStaffByID(staffID) {
    return { ...this.state.staffs.find(s => s._id === staffID) };
  }

  render() {
    const { importingRequests, staffs } = this.state;
    const pendingRequests = importingRequests.filter(r => r.status === CONSTANT.STATUS.PENDING.type);
    const acceptedRequests = importingRequests.filter(r => r.status === CONSTANT.STATUS.ACCEPTED.type);
    const finishedRequests = importingRequests.filter(r => r.status === CONSTANT.STATUS.FINISHED.type);

    return (
      <div className="importing-request animated fadeIn">
        <div className="importing-request__container">
          <Row gutter={10} style={{ width: '100%', height: '100%', margin: 0 }}>
            <Col span={5}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --pending">
                    Đang chờ duyệt
                  </span>
                  <span className="importing-request__container__block__header__number --pending">
                    {pendingRequests.length}
                  </span>
                </div>
                <div className="importing-request__container__block__body --pending">
                  {pendingRequests.map(r => (
                    <PendingRequest
                      key={r._id}
                      details={{ ...r }}
                      importers={staffs.filter(s => s.role === USER_ROLES.IMPORTER.type)}
                    />
                  ))}
                </div>
                <StatisticPendingRequestDialog
                  pendingRequests={[...pendingRequests]}
                  importers={staffs.filter(s => s.role === USER_ROLES.IMPORTER.type)}
                />
              </div>
            </Col>
            <Col span={5}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --accepted">
                    Đang thực hiện
                  </span>
                  <span className="importing-request__container__block__header__number --accepted">
                    {acceptedRequests.length}
                  </span>
                </div>
                <div className="importing-request__container__block__body">
                  {/* {acceptedRequests.map(r => (
                    <Request
                      key={r._id}
                      details={{ ...r }}
                    />
                  ))} */}
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --finished">
                    Đã hoàn tất
                  </span>
                  <span className="importing-request__container__block__header__number --finished">
                    {finishedRequests.length}
                  </span>
                </div>
                <div className="importing-request__container__block__body">
                  {/* {finishedRequests.map(r => (
                    <Request
                      key={r._id}
                      details={{ ...r }}
                    />
                  ))} */}
                </div>
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
export default connect(null, actions)(withCookies(ImportingRequest));