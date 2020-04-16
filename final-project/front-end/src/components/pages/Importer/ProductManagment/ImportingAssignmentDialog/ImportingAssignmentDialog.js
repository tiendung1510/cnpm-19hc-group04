import React, { Component } from 'react';
import { Modal, Row, Col, Table, Progress } from 'antd';
import './ImportingAssignmentDialog.style.scss';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import IMPORTING_REQUEST from '../../../../../constants/importing-request.constant';

export default class ImportingAssignmentDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ isVisible: props.isVisible });
  }

  setDialogVisible(isVisible) {
    this.setState({ isVisible });
  }

  render() {
    const { data } = this.props;
    const importedProducts = data.importedProducts.map((p, i) => ({ ...p, key: i }));
    const columns = [
      {
        title: 'Sản phẩm',
        dataIndex: 'product',
        key: 'product',
        width: 200,
        render: (value, record) => (
          <div>
            <img src={record.product.image} alt="product" style={{ width: 20, margin: 15 }} />
            <span>{record.product.name}</span>
          </div>
        )
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'supplier',
        key: 'supplier',
        width: 200,
        render: (value, record) => record.product.supplier.name
      },
      {
        title: 'Giá bán',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        render: (value, record) => (
          <NumberFormat
            value={record.product.price}
            displayType="text"
            thousandSeparator={true}
            suffix=" VNĐ"
            style={{ fontWeight: 'bold' }}
          />
        )
      },
      {
        title: <center>SL yêu cầu</center>,
        dataIndex: 'requiredQuantity',
        key: 'requiredQuantity',
        width: 100,
        render: (value, record) => <center>{record.requiredQuantity}</center>
      },
      {
        title: <center>SL đã nhập</center>,
        dataIndex: 'importedQuantity',
        key: 'importedQuantity',
        width: 100,
        render: (value, record) => <center>{record.importedQuantity}</center>
      }
    ];
    const importedQuantityTotal = importedProducts.reduce((acc, cur) => acc + cur.importedQuantity, 0);
    const requiredQuantityTotal = importedProducts.reduce((acc, cur) => acc + cur.requiredQuantity, 0);
    const importedPriceTotal = importedProducts.reduce((acc, cur) => acc + (cur.importedQuantity * cur.product.price), 0);

    return (
      <Modal
        className="importing-assignment-dialog"
        title={<span style={{ color: '#ff8220', fontWeight: 'bold' }}>Yêu cầu nhập hàng</span>}
        visible={this.state.isVisible}
        footer={null}
        onCancel={() => {
          this.setDialogVisible(false);
          this.props.setImportingAssignmentDialogVisible(false);
        }}
      >
        <Row style={{ width: '100%' }}>
          <Col span={7}>
            <ul className="importing-assignment-dialog__labels">
              <li>Người bàn giao</li>
              <li>Bàn giao lúc</li>
              <li>Trạng thái</li>
              <li>Mức độ hoàn thành</li>
              <li>Tổng chi phí nhập hàng</li>
              <li>Tổng sản phẩm cần nhập</li>
            </ul>
          </Col>
          <Col span={17}>
            <ul className="importing-assignment-dialog__values">
              <li><strong>{data.manager.fullname}</strong></li>
              <li>{moment(data.createdAt).format('HH:mm DD-MM-YYYY')}</li>
              <li><span className="importing-assignment-dialog__values__status">{IMPORTING_REQUEST.STATUS.ACCEPTED.name}</span></li>
              <li>
                <Progress
                  strokeColor="#ff8220"
                  percent={(importedQuantityTotal / requiredQuantityTotal) * 100} status="active"
                />
              </li>
              <li>
                <strong>
                  <span style={{ marginRight: 3 }}>{importedPriceTotal}</span>/
                    <NumberFormat
                    value={data.priceTotal}
                    displayType="text"
                    thousandSeparator={true}
                    suffix=" VNĐ"
                    style={{ marginLeft: 3 }}
                  />
                </strong>
              </li>
              <li>
                <span style={{ marginRight: 3 }}>{importedQuantityTotal}</span>/
                  <span style={{ marginLeft: 3 }}>{requiredQuantityTotal}</span>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="importing-assignment-dialog__products">
          <Table
            dataSource={importedProducts}
            columns={columns}
            pagination={false}
            scroll={{ y: 250 }}
          />
        </div>
      </Modal>
    )
  }
}
