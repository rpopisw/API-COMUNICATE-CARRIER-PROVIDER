class CustomException{
  constructor(
    code,
    message,
    detail,
    httpStatus,
  ) {
    this.code = code;
    this.message = message; 
    this.detail = detail.map(val=>val.message);
    this.httpStatus = httpStatus;
  }
}

module.exports = CustomException;
