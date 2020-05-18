import React from 'react';
import { Row, Col, Button } from 'antd';
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
import ImporterAssignment from './ImporterAssignment/ImporterAssignment';
import { ReloadOutlined } from '@ant-design/icons';

class ImportingRequest extends PageBase {

  constructor(props) {
    super(props);
    this.state = {
      staffs: [],
      importingRequests: [],
      importerAssignments: []
    }
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    try {
      const results = await Promise.all([
        this.loadStaffs(),
        this.loadImportingRequests(),
        this.loadImporterAssignments()
      ]);
      const staffs = results[0];
      const importingRequests = results[1];
      const importerAssignments = results[2];
      this.setState({
        staffs,
        importingRequests,
        importerAssignments
      });
    } catch (error) {
      if (typeof error === 'string')
        message.error(error);
    }
  }

  async loadStaffs() {
    try {
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

      this.props.setAppLoading(false);
      if (res.status !== 200) {
        return Promise.reject(res.errors[0]);
      }

      return Promise.resolve(res.data.users);
    } catch (error) {
      return error;
    }
  }

  async loadImportingRequests() {
    try {
      this.props.setAppLoading(true);
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

      this.props.setAppLoading(false);
      if (res.status !== 200) {
        return Promise.reject(res.errors[0]);
      }

      return Promise.resolve(res.data.importingRequests);
    } catch (error) {
      return error;
    }
  }

  async loadImporterAssignments() {
    try {
      this.props.setAppLoading(true);
      const res = await (
        await fetch(
          API.Manager.ImportingRequestManagement.getImporterAssignments,
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
        return Promise.reject(res.errors[0]);
      }

      return Promise.resolve(res.data.importerAssignments);
    } catch (error) {
      return error;
    }
  }

  getStaffByID(staffID) {
    return { ...this.state.staffs.find(s => s._id === staffID) };
  }

  async onAcceptRequests() {
    const importerAssignments = await this.loadImporterAssignments();
    this.setState({
      importingRequests: [],
      importerAssignments
    });
  }

  setImportingRequests(importingRequests) {
    this.setState({ importingRequests });
  }

  async reloadImportingRequests() {
    try {
      const importingRequests = await this.loadImportingRequests();
      this.setState({ importingRequests });
    } catch (error) {
      return error;
    }
  }

  render() {
    const { importingRequests, staffs, importerAssignments } = this.state;
    const pendingRequests = (importingRequests || []).filter(r => r.status === CONSTANT.STATUS.PENDING.type);
    const notFinishedAssignments = (importerAssignments || []).filter(a => a.finishedAt === null);
    const finishedAssignments = (importerAssignments || []).filter(a => a.finishedAt !== null);

    return (
      <div className="importing-request">
        <div className="importing-request__container">
          <Row gutter={[10, 10]} style={{ width: '100%', height: '100%', margin: 0 }}>
            <Col span={5} md={5} xs={24}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --pending">
                    Đang chờ duyệt
                  </span>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<ReloadOutlined />}
                    className="importing-request__container__block__header__btn-update"
                    onClick={() => this.reloadImportingRequests()}
                  />
                  <span className="importing-request__container__block__header__number --pending">
                    {pendingRequests.length}
                  </span>
                </div>
                <StatisticPendingRequestDialog
                  pendingRequests={[...pendingRequests]}
                  importers={staffs.filter(s => s.role === USER_ROLES.IMPORTER.type && s.isImporterAssignmentFinished)}
                  onAcceptRequests={() => this.onAcceptRequests()}
                />
                <div className="importing-request__container__block__body --pending">
                  {pendingRequests.map(r => (
                    <PendingRequest
                      key={r._id}
                      details={{ ...r }}
                      importers={staffs.filter(s => s.role === USER_ROLES.IMPORTER.type)}
                      onUpdateImportingRequests={requests => this.setImportingRequests(requests)}
                    />
                  ))}
                </div>
              </div>
            </Col>
            <Col span={5} md={5} xs={24}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --accepted">
                    Đang thực hiện
                  </span>
                  <span className="importing-request__container__block__header__number --accepted">
                    {notFinishedAssignments.length}
                  </span>
                </div>
                <div className="importing-request__container__block__body">
                  {notFinishedAssignments.map(a => (
                    <ImporterAssignment data={{ ...a }} key={a._id} />
                  ))}
                </div>
              </div>
            </Col>
            <Col span={5} md={5} xs={24}>
              <div
                className="importing-request__container__block">
                <div className="importing-request__container__block__header">
                  <span className="importing-request__container__block__header__title --finished">
                    Đã hoàn tất
                  </span>
                  <span className="importing-request__container__block__header__number --finished">
                    {finishedAssignments.length}
                  </span>
                </div>
                <div className="importing-request__container__block__body">
                  {finishedAssignments.map(a => (
                    <ImporterAssignment data={{ ...a }} key={a._id} />
                  ))}
                </div>
              </div>
            </Col>
            <Col span={9} md={9} xs={24}>
              <SupplierManagement />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
export default connect(null, actions)(withCookies(ImportingRequest));