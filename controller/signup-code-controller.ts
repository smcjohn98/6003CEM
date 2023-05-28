import { Request, Response, NextFunction } from 'express';
import SignupCode from '../model/signup-code';
import ResponseMessage, { ErrorCode } from '../bean/response-message'

export default class SignupCodeController {
  async getAll(request: Request, response: Response, next: NextFunction) {
    //Get All
    let list = await SignupCode.findAll();

    response.send(new ResponseMessage("OK", ErrorCode.noError, { signupCode: list }));
  }

  async insert(request: Request, response: Response, next: NextFunction) {
    const code = String.fromCharCode(getRandomInt(26)+65, getRandomInt(26)+65, getRandomInt(26)+65, getRandomInt(26)+65)
    const a = await SignupCode.create({ code: code, isValid: true })

    response.send(new ResponseMessage("OK", ErrorCode.noError, {code: code}));
  }

  async delete(request: Request, response: Response, next: NextFunction) {

    // Check User Existed
    const signupCode = await SignupCode.findByPk(request.params.id);
    if (signupCode === null) {
      return response.status(404).json(new ResponseMessage("Signup Code  Not Found", ErrorCode.resourceNotFound, {}));
    }

    //Delete User
    signupCode.destroy();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }
}

function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}