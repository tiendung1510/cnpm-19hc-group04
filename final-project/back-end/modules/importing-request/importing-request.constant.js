module.exports = {
  IMPORTING_REQUEST_MESSAGE: {
    SUCCESS: {
      CREATE_IMPORTING_REQUEST_SUCCESS: 'Đã gửi yêu cầu nhập hàng'
    },
    ERROR: {

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
    }
  },
  CONTROLLER_NAME: 'ImportingRequestController'
}