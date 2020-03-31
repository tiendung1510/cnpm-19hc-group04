import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Button, Modal, Tooltip, Input, Table, Empty, Dropdown, Menu } from 'antd';
import { RocketOutlined, SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import './SupplierDialog.style.scss';
import moment from 'moment';

class SupplierDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      suppliers: [],
      filteredSuppliers: [],
      supplierSearchText: ''
    }
  }

  resetAllStates() {
    this.setState({
      isVisible: false,
      suppliers: [],
      filteredSuppliers: [],
      supplierSearchText: ''
    })
  }

  componentDidMount() {
    let { suppliers } = this.props;
    if (suppliers.length === 0)
      return;

    suppliers = suppliers
      .map(s => ({ ...s, key: s._id, checked: false }))
      .filter(s => s._id !== 'ALL')
      .map((s, i) => ({ ...s, order: i + 1 }));

    // for (let i = 0; i < 20; i++)
    //   suppliers.push(suppliers[0]);

    this.setState({ suppliers });
  }

  setDialogVisible(isVisible) {
    this.setState({ isVisible });
  }

  onOk() {

  }

  render() {
    const { suppliers } = this.state;

    const columns = [
      {
        title: 'STT',
        dataIndex: 'order',
        key: 'order',
        width: 80
      },
      {
        title: 'Tên thương hiệu',
        dataIndex: 'name',
        key: 'name',
        width: 200
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        key: 'phone',
        width: 150
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
        width: 150
      },
      {
        title: 'Cập nhật lần cuối',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (updatedAt) => `Lúc ${moment(updatedAt).format('HH:mm DD-MM-YYYY')}`,
        width: 170
      },
      {
        title: '',
        dataIndex: '',
        key: '',
        render: (text, recored) => (
          <Dropdown overlay={
            <Menu onClick={e => console.log(e)}>
              <Menu.Item key="EDIT">Chỉnh sửa</Menu.Item>
              <Menu.Item key="REMOVE">Xóa</Menu.Item>
            </Menu>
          }>
            <EditOutlined className="product-management__supplier-dialog__content__suppliers__btn-menu" />
          </Dropdown>
        )
      }
    ];

    return (
      <div className="product-management__supplier-dialog">
        <Tooltip title="Nhà cung cấp sản phẩm" placement="left">
          <Button
            shape="circle"
            icon={<RocketOutlined />}
            className="product-management__supplier-dialog__btn-open animated bounceIn"
            onClick={() => this.setDialogVisible(true)}
          />
        </Tooltip>

        <Modal
          className="product-management__supplier-dialog__content"
          title={
            <div className="product-management__supplier-dialog__content__title">
              <div className="product-management__supplier-dialog__content__title__icon-wrapper">
                <RocketOutlined className="product-management__supplier-dialog__content__title__icon-wrapper__icon" />
              </div>
              <span className="product-management__supplier-dialog__content__title__text">Nhà cung cấp sản phẩm</span>
            </div>
          }
          visible={this.state.isVisible}
          onCancel={() => {
            this.setDialogVisible(false);
          }}
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <div className="product-management__supplier-dialog__content__toolbar">
            <Input prefix={<SearchOutlined style={{ marginRight: 3 }} />} placeholder="Tìm kiếm nhà cung cấp..." />
            <Button
              shape="circle"
              icon={<PlusOutlined />}
              className="product-management__supplier-dialog__content__toolbar__btn-open-add-supplier-form"
            />
          </div>

          <div className="product-management__supplier-dialog__content__suppliers">
            <Table
              dataSource={[...suppliers]}
              columns={columns}
              pagination={false}
              scroll={{ y: 300 }}
              locale={{ emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu" />) }}
            />
          </div>

        </Modal>
      </div>
    )
  }
}
export default withCookies(SupplierDialog);
