import React, { Component } from 'react';
import { Popover, Button, Tooltip, Table } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import './ImportingHistory.style.scss';
import moment from 'moment';

export default class ImportingHistory extends Component {
  render() {
    let { importedProducts } = this.props;
    importedProducts = importedProducts.map((p, i) => ({ ...p, key: i }));
    const columns = [
      {
        title: 'Mã sản phẩm',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (value, record) => record.details._id
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (value, record) => record.details.name
      },
      {
        title: <center>SL cần nhập</center>,
        dataIndex: 'requiredQuantity',
        width: 100,
        key: 'requiredQuantity',
        render: value => <center>{value}</center>
      },
      {
        title: <center>SL đã nhập</center>,
        dataIndex: 'importedQuantity',
        width: 100,
        key: 'importedQuantity',
        render: value => <center>{value}</center>
      },
      {
        title: <center>Lần nhập cuối</center>,
        dataIndex: 'updatedAt',
        width: 100,
        key: 'updatedAt',
        render: (value, record) => record.importedQuantity > 0 ? (<center>{moment(value).format('HH:mm DD/MM/YYYY')}</center>) : ''
      }
    ];

    return (
      <div className="importing-history">
        <Popover
          placement="right"
          title="Sản phẩm cần nhập"
          content={
            <Table
              dataSource={importedProducts}
              columns={columns}
              pagination={false}
            />
          }
          trigger="click"
          overlayClassName="importing-history__content"
        >
          <Tooltip title="Sản phẩm cần nhập" placement="top">
            <Button
              type="default"
              icon={<UnorderedListOutlined />}
              shape="circle"
              className="importing-history__btn-show"
            />
          </Tooltip>
        </Popover>
      </div>
    )
  }
}
