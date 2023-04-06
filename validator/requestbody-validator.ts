import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import ResponseMessage, { ErrorCode } from '../bean/response-message'

const requestbodyValidator = (request: Request, response: Response, next: NextFunction) => {
  //Skip next and throw error if validation error
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json(new ResponseMessage("Bad Request", ErrorCode.bodyBadRequest, errors));
  }
  next()
}
export default requestbodyValidator;
