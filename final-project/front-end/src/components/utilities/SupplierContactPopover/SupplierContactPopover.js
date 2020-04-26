import React, { Component } from 'react';
import { Popover, Button, Row, Col } from 'antd';
import './SupplierContactPopover.style.scss';
import GoogleMap from '../GoogleMap/GoogleMap';
import { EnvironmentTwoTone } from '@ant-design/icons';

export default class SupplierContactPopover extends Component {
  render() {
    const { supplier, buttonText, buttonStyle, placement } = this.props;
    const content = (
      <div className="supplier-contact-popover__content">
        <Row style={{ width: '100%' }} gutter={15}>
          <Col span={8}>Thương hiệu</Col>
          <Col span={16}><strong>{supplier.name}</strong></Col>
        </Row>
        <Row style={{ width: '100%' }} gutter={15}>
          <Col span={8}>Số điện thoại</Col>
          <Col span={16}>{supplier.phone}</Col>
        </Row>
        <Row style={{ width: '100%' }} gutter={15}>
          <Col span={8}>Địa chỉ</Col>
          <Col span={16}>{supplier.address}</Col>
        </Row>
        <GoogleMap
          width={'100%'}
          height={200}
          address={supplier.address}
          locationIcon={
            <EnvironmentTwoTone
              twoToneColor="#ff8220"
              style={{ fontSize: 24 }}
            />
          }
        />
      </div>
    )
    return (
      <div className="supplier-contact-popover">
        <Popover
          placement={placement}
          title="Liên hệ nhà cung cấp"
          content={content} trigger="click"
          overlayClassName="supplier-contact-popover__popover"
        >
          <Button
            type="link"
            style={{ ...buttonStyle, paddingLeft: 0 }}
            className="supplier-contact-popover__btn"
          >
            {buttonText}
          </Button>
        </Popover>
      </div>
    )
  }
}
