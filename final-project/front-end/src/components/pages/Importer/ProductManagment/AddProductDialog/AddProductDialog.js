import React, { Component } from 'react';
import './AddProductDialog.style.scss';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import * as actions from '../../../../../redux/actions';
import { Button, Modal, Form, Input, InputNumber, message, Select, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImageUploader from '../../../../utilities/ImageUploader/ImageUploader';
import * as _ from 'lodash';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class AddProductDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    }

    this.formRef = React.createRef();
  }

  setDialogVisible(isVisible) {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }
    this.setState({ isVisible });
  }

  async onOK() {
    document.getElementById('product-management-add-product-dialog-btn-submit').click();
  }

  onFinish(values) {
    const params = { ...values };

    const product = {
      "name": "Sữa bò tươi không đường",
      "image": "https://product.hstatic.net/1000074072/product/1l-ko-d__ng-min.png",
      "price": 8000,
      "availableQuantity": 10,
      "_id": "5e72350bcbf81e53804eb2bb",
      "category": {
        "name": "Sữa tiệt trùng",
        "_id": "5e70eb4acac22205b7530292",
        "createdAt": "2020-03-17T15:22:50.312Z",
        "updatedAt": "2020-03-18T14:49:47.494Z",
        "__v": 10
      },
      "supplier": {
        "phone": "0999999999",
        "address": "New York",
        "_id": "5e70eb46cac22205b7530291",
        "name": "Vinamilk",
        "createdAt": "2020-03-17T15:22:46.783Z",
        "updatedAt": "2020-03-18T14:49:47.609Z",
        "__v": 10
      },
      "createdAt": "2020-03-18T14:49:47.389Z",
      "updatedAt": "2020-03-18T14:49:47.389Z",
      "__v": 0
    }

    for (const k in params) {
      if (k !== 'supplier') {
        product[k] = params[k];
      } else {
        const index = _.findIndex(this.props.suppliers, s => s._id === params[k]);
        if (index < 0)
          return;
        product[k] = { ...this.props.suppliers[index] };
      }
    }

    this.setDialogVisible(false);
    this.props.addToListProducts({ ...product });
    message.success('SUCCESS');
  }

  render() {
    const { selectedCategory } = this.props;
    return (
      <div className="product-management__add-product-dialog">
        <Tooltip title="Thêm sản phẩm mới" placement="left">
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            className="product-management__add-product-dialog__btn-open animated bounceIn"
            onClick={() => this.setDialogVisible(true)}
          />
        </Tooltip>

        <Modal
          title={<span style={{ color: '#ff8220', fontWeight: 'bold' }}>{`${selectedCategory.name} | Thêm sản phẩm mới`}</span>}
          visible={this.state.isVisible}
          onOk={() => this.onOK()}
          onCancel={() => this.setDialogVisible(false)}
          okText="Hoàn tất"
          cancelText="Hủy bỏ"
          okButtonProps={{ style: { background: '#ff8220', border: 0 } }}
        >
          <div className="product-management__add-product-dialog__content">
            <div className="product-management__add-product-dialog__content__img-uploading">
              <ImageUploader
                width={150}
                height={150}
                tooltipTitle="Nhấn để thay đổi ảnh"
                tooltipPlacement="bottom"
                onFinish={imageUrl => this.formRef.current.setFieldsValue({ image: imageUrl })}
              />
            </div>
            <Form
              {...layout}
              ref={current => {
                this.formRef.current = current;
                if (this.formRef.current) {
                  this.formRef.current.setFieldsValue({ supplier: this.props.suppliers[0]._id })
                }
              }}
              className="product-management__add-product-dialog__content__form"
              onFinish={values => this.onFinish(values)}
              onFinishFailed={() => message.error('Thông tin sản phẩm chưa đầy đủ, vui lòng kiểm tra lại.')}
            >
              <Form.Item name="image" rules={[{ required: true }]} style={{ display: 'none' }}>
                <Input />
              </Form.Item>

              <Form.Item style={{ display: 'none' }}>
                <Button id="product-management-add-product-dialog-btn-submit" htmlType="submit" />
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input placeholder="Tối đa 50 kí tự" />
              </Form.Item>

              <Form.Item
                name="supplier"
                label="Nhà cung cấp"
                rules={[{ required: true }]}
              >
                <Select>
                  {this.props.suppliers.map(s => (
                    <Select.Option value={s._id} key={s._id}>{s.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá bán (VNĐ)"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập giá bán'
                  }
                ]}
              >
                <InputNumber
                  placeholder="Tối thiểu là 0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="availableQuantity"
                label="Số lượng hiện có"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng hiện có'
                  }
                ]}
              >
                <InputNumber
                  placeholder="Tối thiểu là 0"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}
export default connect(null, actions)(withCookies(AddProductDialog));


