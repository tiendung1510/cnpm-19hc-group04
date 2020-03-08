import React, { Component } from 'react';
import { Avatar } from 'antd';
import './UserInfo.style.scss';
import USER_ROLE from '../../../../constants/user-role.constant';

export default class UserInfo extends Component {

  render() {
    const user = this.props.user;
    const userRoleName = USER_ROLE[user.role].name;
    let userRoleStyle;
    switch (user.role) {
      case USER_ROLE.CASHIER.role: userRoleStyle = '__wallpaper__role--cashier'; break;
      case USER_ROLE.IMPORTER.role: userRoleStyle = '__wallpaper__role--importer'; break;
      case USER_ROLE.MANAGER.role: userRoleStyle = '__wallpaper__role--manager'; break;
      default: break;
    }

    return (
      <div className="user-info">
        <div className="__wallpaper" style={{ backgroundImage: `url(${user.avatar})` }}>
          <div className={`__wallpaper__role ${userRoleStyle} animated fadeInRight`}>
            <span>{userRoleName}</span>
          </div>
          <div className="__wallpaper__info">
            <div className="__wallpaper__info__fullname"><span>{user.fullname || ''}</span></div>
            <span className="__wallpaper__info__email">{user.email || ''}</span>
          </div>
          <div className="__wallpaper__dark-bg"></div>
        </div>
        <div className="__avatar">
          <Avatar size={68} src={user.avatar} className="__avatar__image" />
        </div>
      </div>
    )
  }
}
