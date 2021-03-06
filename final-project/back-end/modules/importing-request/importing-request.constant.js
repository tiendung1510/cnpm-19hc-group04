module.exports = {
  IMPORTING_REQUEST_MESSAGE: {
    SUCCESS: {
      CREATE_IMPORTING_REQUEST_SUCCESS: 'Đã gửi yêu cầu nhập hàng',
      GET_IMPORTING_REQUESTS_SUCCESS: 'Lấy danh sách yêu cầu nhập hàng thành công',
      ACCEPT_IMPORTING_REQUEST_SUCCESS: 'Bàn giao thực hiện yêu cầu thành công',
      CANCEL_IMPORTING_REQUEST_SUCCESS: 'Từ chối yêu cầu thành công'
    },
    ERROR: {
      EMPTY_LIST_REQUIRED_PRODUCTS: 'Danh sách sản phẩm yêu cầu không được để trống',
      REQUIRED_PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm yêu cầu',
      EXECUTOR_NOT_FOUND: 'Không tìm thấy người thực hiện',
      IMPORTING_REQUEST_NOT_FOUND: 'Không tìm thấy yêu cầu nhập hàng',
      REACCEPTED_IMPORTING_REQUEST: 'Có yêu cầu đã được bàn giao thực hiện',
      EXECUTOR_ASSIGNMENT_HAS_NOT_BEEN_FINISHED: 'Nhân viên này đang thực hiện một yêu cầu khác'
    }
  },
  STATUS: {
    PENDING: {
      type: 'PENDING',
      name: 'Đang chờ duyệt'
    },
    ACCEPTED: {
      type: 'ACCEPTED',
      name: 'Đã được chấp nhận'
    },
    FINISHED: {
      type: 'FINISHED',
      name: 'Đã thực hiện xong'
    },
    CANCELLED: {
      type: 'CANCELLED',
      name: 'Đã bị từ chối'
    }
  },
  CONTROLLER_NAME: 'ImportingRequestController'
}