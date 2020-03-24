import React from 'react';
import './MoneyCounting.style.scss';
import PageBase from '../../../utilities/PageBase/PageBase';
import { withCookies } from 'react-cookie';
import QrReader from 'react-qr-reader';

class MoneyCounting extends PageBase {
  constructor(props) {
    super(props);
    this.state = {
      result: 'No result'
    }
  }

  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      })
    }
  }

  render() {
    return (
      <div className="money-counting">
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: 500, height: 500 }}
        />
        <p style={{padding: 20}}>{this.state.result}</p>
      </div>
    )
  }
}
export default withCookies(MoneyCounting)
