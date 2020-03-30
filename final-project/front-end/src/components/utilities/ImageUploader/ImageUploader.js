import React, { Component } from 'react';
import { Upload, message, Tooltip } from 'antd';
import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import './ImageUploader.style.scss'

export default class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: ''
    }
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => {
        this.props.onFinish(imageUrl);
        this.setState({
          imageUrl,
          loading: false
        });
      });
    }
  };

  render() {
    let { defaultImageUrl, width, height, tooltipTitle, tooltipPlacement } = this.props;
    const { imageUrl } = this.state;

    const uploadedImage = (
      <div>
        {defaultImageUrl ? (
          <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
            <img src={defaultImageUrl} alt="default" style={{ width: '100%' }} />
          </Tooltip>
        ) : (
            <div className="image-uploader--empty" style={{ width, height }}>
              <PictureOutlined />
              <span className="image-uploader--empty__text">Đăng tải ảnh</span>
            </div>
          )}
      </div>
    );

    const uploadButton = (
      <div style={{ width, height }} className="image-uploader__btn-upload">
        {
          this.state.loading ? (
            <LoadingOutlined />
          ) : uploadedImage
        }
      </div>
    );

    return (
      <div className="image-uploader" style={{ width, height }}>
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={e => this.beforeUpload(e)}
          onChange={e => this.handleChange(e)}
        >
          {imageUrl ? (
            <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
              <img src={imageUrl} alt="uploaded" style={{ width: '100%' }} />
            </Tooltip>
          ) : uploadButton}
        </Upload>
      </div>
    )
  }
}
