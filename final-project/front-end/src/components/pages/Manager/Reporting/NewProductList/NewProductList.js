import React, { Component } from 'react';
import './ NewProductList.style.scss';
import { Button, Popover, Tooltip, Table } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import SupplierContactPopover from '../../../../utilities/SupplierContactPopover/SupplierContactPopover';
import moment from 'moment';

export default class NewProductList extends Component {
  render() {
    let { newProducts } = this.props;
    newProducts = newProducts.map((p, i) => ({ ...p, key: i }));
    const columns = [
      {
        title: '',
        dataIndex: 'image',
        key: 'image',
        width: 60,
        render: (text) => (
          <img
            style={{ width: 25, marginLeft: 10 }}
            src={text}
            alt="product" />
        )
      },
      {
        title: 'Sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 200
      },
      {
        title: 'Thể loại',
        dataIndex: 'category',
        key: 'category',
        width: 180,
        render: (text, record) => (<span>{record.category.name}</span>)
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'supplier',
        key: 'supplier',
        width: 200,
        render: (text, record) => (
          <SupplierContactPopover
            supplier={{ ...record.supplier }}
            buttonText={record.supplier.name}
            buttonStyle={{ fontSize: 11 }}
            placement="right"
          />
        )
      },
      {
        title: 'Giá bán',
        dataIndex: 'price',
        key: 'price',
        width: 120,
        render: (text) => (
          <NumberFormat
            value={Number(text)}
            displayType="text"
            thousandSeparator={true}
            suffix=" đ̲"
          />
        )
      },
      {
        title: <center>SL hiện có</center>,
        dataIndex: 'availableQuantity',
        key: 'availableQuantity',
        width: 100,
        render: (text) => (<center>{text}</center>)
      },
      {
        title: <center>Thêm lúc</center>,
        dataIndex: 'addedAt',
        key: 'addedAt',
        width: 80,
        render: (text) => (<center>{moment(text).format('HH:mm DD/MM/YYYY')}</center>)
      },
      {
        title: <center>Thực hiện</center>,
        dataIndex: 'executor',
        key: 'executor',
        width: 100,
        render: value => (<center>{value.fullname}</center>)
      }
    ];

    return (
      <div className="new-product-list">
        <Popover
          overlayClassName="new-product-list__content"
          placement="bottomRight"
          title="Sản phẩm mới"
          content={
            <Table
              dataSource={[...newProducts]}
              columns={columns}
              pagination={false}
            />
          }
          trigger="click">
          <Tooltip title="Sản phẩm mới" placement="top">
            <Button
              icon={<HistoryOutlined />}
              shape="circle"
              className="product-quantity-statistic__item__btn"
            />
          </Tooltip>
        </Popover>
      </div>
    )
  }
}
