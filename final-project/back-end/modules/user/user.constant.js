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
      DUPLICATED_EMAIL: 'Địa chỉ email đã được sử dụng',
      CONFIRMED_NEW_PASSWORD_NOT_MATCHED: 'Nhập lại mật khẩu mới không chính xác',
      WRONG_CURRENT_PASSWORD: 'Mật khẩu hiện tại không chính xác'
    },
    SUCCESS: {
      LOGIN_SUCCESS: 'Đăng nhập thành công',
      ADD_USER_SUCCESS: 'Thêm người dùng thành công',
      GET_USERS_SUCCESS: 'Lấy danh sách người dùng thành công',
      CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công'
    }
  },
  CONTROLLER_NAME: 'UserController',
  PASSWORD_SALT_ROUNDS: 10
};
