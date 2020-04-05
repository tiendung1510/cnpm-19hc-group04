import React from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { RightOutlined, PrinterOutlined } from '@ant-design/icons';
import './SubmitCheckoutSessionDialog.style.scss';
import PageBase from '../../../../utilities/PageBase/PageBase';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import * as actions from '../../../../../redux/actions';
import moment from 'moment';
import BillToPrint from './BillToPrint/BillToPrint';
import ReactToPrint from 'react-to-print';

class SubmitCheckoutSessionDialog extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      checkoutSession: {}
    }
  }

  setDialogVisible(isVisible) {
    this.setState({ isVisible });
  }

  onOK() {
    document.getElementById('money-counting-submit-checkout-session-dialog-btn-print-bill').click();
  }

  async submitCheckoutSession() {
    const { checkoutSessionID } = this.props;
    const res = {
      "status": 200,
      "data": {
        "checkoutSession": {
          "soldItems": [
            {
              "quantity": 3,
              "_id": "5e8a0bdeb8f59d12ad7fc178",
              "product": {
                "name": "Sữa bò tươi có đường",
                "price": 8000,
                "availableQuantity": 11,
                "_id": "5e70f8e809d06d1841aea689"
              },
              "checkoutSession": "5e8a0bceb8f59d12ad7fc177",
              "createdAt": "2020-04-05T16:48:30.731Z",
              "updatedAt": "2020-04-05T16:48:30.731Z",
              "__v": 0
            },
            {
              "quantity": 2,
              "_id": "5e8a0bdeb8f59d12ad7fc179",
              "product": {
                "name": "Dao nhập khẩu Châu Âu",
                "price": 1250000,
                "availableQuantity": 14,
                "_id": "5e85a87a242b435251cdacb0"
              },
              "checkoutSession": "5e8a0bceb8f59d12ad7fc177",
              "createdAt": "2020-04-05T16:48:30.732Z",
              "updatedAt": "2020-04-05T16:48:30.732Z",
              "__v": 0
            },
            {
              "quantity": 1,
              "_id": "5e8a0bdeb8f59d12ad7fc17a",
              "product": {
                "name": "Sữa ADM Gold",
                "price": 40000,
                "availableQuantity": 17,
                "_id": "5e84abd73866907a1d35da6d"
              },
              "checkoutSession": "5e8a0bceb8f59d12ad7fc177",
              "createdAt": "2020-04-05T16:48:30.732Z",
              "updatedAt": "2020-04-05T16:48:30.732Z",
              "__v": 0
            }
          ],
          "priceTotal": 2564000,
          "submittedAt": "2020-04-05T16:48:31.153Z",
          "_id": "5e8a0bceb8f59d12ad7fc177",
          "cashier": "5e80295b917650122d2e5d17",
          "createdAt": "2020-04-05T16:48:14.335Z",
          "updatedAt": "2020-04-05T16:48:31.156Z",
          "__v": 1
        }
      },
      "messages": [
        "Hoàn tất phiên tính tiền"
      ]
    };

    const { checkoutSession } = res.data;
    this.setState({ checkoutSession });

    this.setDialogVisible(true);
  }

  render() {
    const { checkedOutProducts } = this.props;
    const { checkoutSession } = this.state;
    return (
      <div className="money-counting__submit-checkout-session-dialog">
        <Button
          className="money-counting__submit-checkout-session-dialog__btn-open"
          type="primary"
          disabled={checkedOutProducts.length === 0}
          onClick={() => this.submitCheckoutSession()}
        >
          <span style={{ marginRight: 5 }}>Hoàn tất tính tiền</span>
          <RightOutlined />
        </Button>

        <Modal
          className="money-counting__submit-checkout-session-dialog__content"
          title={
            <span style={{ color: '#ff8220', fontWeight: 'bold' }}>
              Hóa đơn bán hàng | Lúc {moment(checkoutSession.submittedAt).format('HH:mm DD-MM-YYYY')}
            </span>
          }
          visible={this.state.isVisible}
          onOk={() => this.onOK()}
          onCancel={() => this.setDialogVisible(false)}
          okText="In hóa đơn"
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          {Object.keys(checkoutSession).length > 0 ? (
            <div className="money-counting__submit-checkout-session-dialog__content__bill">
              <div className="money-counting__submit-checkout-session-dialog__content__bill__toolbar">
                <Tooltip title="In hóa đơn" placement="left">
                  <Button
                    className="money-counting__submit-checkout-session-dialog__content__bill__toolbar__item"
                    shape="circle"
                    icon={<PrinterOutlined />} />
                </Tooltip>
              </div>
              <div className="money-counting__submit-checkout-session-dialog__content__bill__wrapper">
                <ReactToPrint
                  trigger={() => (
                    <Button style={{ display: 'none' }} id="money-counting-submit-checkout-session-dialog-btn-print-bill" />
                  )}
                  content={() => this.componentToPrintRef}
                />
                <BillToPrint
                  ref={el => (this.componentToPrintRef = el)}
                  checkoutSession={{ ...checkoutSession }}
                />
              </div>
            </div>
          ) : <></>}
        </Modal>
      </div>
    )
  }
}
export default connect(null, actions)(withCookies(SubmitCheckoutSessionDialog));