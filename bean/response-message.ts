export default class ResponseMessage{
  message:string;
  errorCode:ErrorCode;
  data:any;
  
  constructor(message:string, errorCode:ErrorCode, data:any) {
    this.message = message;
    this.errorCode = errorCode;
    this.data = data;
  }
}

export enum ErrorCode {
  noError = 0,
  bodyError,
  userNotExisted,
  passwordNotMatch 
}