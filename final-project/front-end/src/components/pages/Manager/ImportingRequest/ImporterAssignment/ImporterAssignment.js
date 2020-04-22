import React from 'react';
import { Row, Col, Avatar, Modal, Table, Progress } from 'antd';
import PageBase from '../../../../utilities/PageBase/PageBase';
import moment from 'moment';
import './ImporterAssignment.style.scss';
import NumberFormat from 'react-number-format';
import IMPORTING_REQUEST from '../../../../../constants/importing-request.constant';
import * as _ from 'lodash';

export default class ImporterAssignment extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
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
            suffix=" đ̲"
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
      <div className="importer-assignment">
        <div
          className="importer-assignment__summary animated fadeIn"
          onClick={() => this.setDialogVisible(true)}
        >
          <Row gutter={10} style={{ width: '100%', height: '100%' }}>
            <Col span={4}>
              <Avatar
                className="importer-assignment__summary__avatar"
                src={data.importer.avatar} size={24}
              />
            </Col>
            <Col span={20}>
              <div className="importer-assignment__summary__details">
                <span className="importer-assignment__summary__details__title">
                  {data.importer.fullname}
                </span>
                <span className="importer-assignment__summary__details__time">
                  {data.finishedAt ? (
                    <span>Hoàn tất lúc {moment(data.finishedAt).format('HH:mm DD-MM-YYYY')}</span>
                  ) : (<span>Bàn giao lúc {moment(data.createdAt).format('HH:mm DD-MM-YYYY')}</span>)}
                </span>
                <p className="importer-assignment__summary__details__products">
                  {data.importedProducts.map((item, index) => {
                    return index < data.importedProducts.length - 1 ? (
                      <span key={index}>{`${item.product.name} x${item.requiredQuantity}, `}</span>
                    ) : (
                        <span key={index}>{`${item.product.name} x${item.requiredQuantity}.`}</span>
                      )
                  })}
                </p>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          className="importer-assignment__content"
          title={<span style={{ color: '#ff8220', fontWeight: 'bold' }}>Thông tin yêu cầu</span>}
          visible={this.state.isVisible}
          footer={null}
          onCancel={() => this.setDialogVisible(false)}
        >
          <Row style={{ width: '100%' }}>
            <Col span={7}>
              <ul className="importer-assignment__content__labels">
                <li>Người thực hiện</li>
                <li>Bàn giao lúc</li>
                <li>Trạng thái</li>
                {data.finishedAt ? <></> : (<li>Mức độ hoàn thành</li>)}
                {data.finishedAt ? (<li>Hoàn tất lúc</li>) : <></>}
                <li>Tổng chi phí nhập hàng</li>
                <li>Tổng sản phẩm cần nhập</li>
              </ul>
            </Col>
            <Col span={17}>
              <ul className="importer-assignment__content__values">
                <li><strong>{data.importer.fullname}</strong></li>
                <li>{moment(data.createdAt).format('HH:mm DD-MM-YYYY')}</li>
                <li><span className="importer-assignment__content__values__status">
                  {data.finishedAt ? (
                    <span>{IMPORTING_REQUEST.STATUS.FINISHED.name}</span>
                  ) : (<span>{IMPORTING_REQUEST.STATUS.ACCEPTED.name}</span>)}
                </span></li>
                <li>
                  {data.finishedAt ? <></> : (
                    <Progress
                      strokeColor="#ff8220"
                      percent={_.round((importedQuantityTotal / requiredQuantityTotal) * 100, 0)} status="active"
                    />
                  )}
                </li>
                {data.finishedAt ? (<li>{moment(data.finishedAt).format('HH:mm DD-MM-YYYY')}</li>) : <></>}
                <li>
                  <strong>
                    <NumberFormat
                      value={importedPriceTotal}
                      displayType="text"
                      thousandSeparator={true}
                      style={{ marginRight: 3 }}
                    />/
                    <NumberFormat
                      value={data.priceTotal}
                      displayType="text"
                      thousandSeparator={true}
                      suffix=" đ̲"
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

          <div className="importer-assignment__content__products">
            <Table
              dataSource={importedProducts}
              columns={columns}
              pagination={false}
              scroll={{ y: 250 }}
            />
          </div>

        </Modal>
      </div>
    )
  }
}
