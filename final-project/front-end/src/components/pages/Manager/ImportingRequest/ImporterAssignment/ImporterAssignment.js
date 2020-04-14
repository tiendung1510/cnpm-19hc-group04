import React from 'react';
import { Row, Col, Avatar } from 'antd';
import PageBase from '../../../../utilities/PageBase/PageBase';
import moment from 'moment';
import './ImporterAssignment.style.scss';

export default class ImporterAssignment extends PageBase {
  render() {
    const { data } = this.props;
    return (
      <div className="importer-assignment">
        <div className="importer-assignment__summary animated fadeIn">
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
                  Bàn giao lúc {moment(data.createdAt).format('HH:mm DD-MM-YYYY')}
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
      </div>
    )
  }
}
