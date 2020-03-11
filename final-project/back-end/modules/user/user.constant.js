module.exports = {
  ROLE: {
    CASHIER: {
      type: 'CASHIER'
    },
    IMPORTER: {
      type: 'IMPORTER'
    },
    MANAGER: {
      type: 'MANAGER'
    }
  },
  MESSAGE: {
    ERROR: {
      USER_NOT_FOUND: 'Tài khoản hoặc mật khẩu không đúng',
      DUPLICATED_USERNAME: 'Tên tài khoản đã được sử dụng',
      DUPLICATED_EMAIL: 'Địa chỉ email đã được sử dụng'
    },
    SUCCESS: {
      LOGIN_SUCCESS: 'Đăng nhập thành công',
      ADD_USER_SUCCESS: 'Thêm người dùng thành công'
    }
  },
  CONTROLLER_NAME: 'UserController'
};
