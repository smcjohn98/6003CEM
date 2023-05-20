import { Request, Response, NextFunction } from 'express';
import AuthenticatedRequest from '../type/AuthenticatedRequest';
import ResponseMessage, { ErrorCode } from '../bean/response-message';
import JWT from 'jsonwebtoken';
import { config } from '../config'

const verifyPermissionMiddleware = (role: Array<String>) => {
  return (request:AuthenticatedRequest, response:Response, next:NextFunction) => 
    verifyPermission(request, response, next, role);
}

function verifyPermission(request:AuthenticatedRequest, response:Response, next:NextFunction, role: Array<String>) {

  if(!request.user)
    return response.status(401).json(new ResponseMessage("Unauthorizated", ErrorCode.forBidden, {}));

  
  let verified = false;
  for(let i=0;i<role.length;i++){
    if(role[i] === request.user.role){
      verified = true;
      break;
    }
  }

  if(!verified)
    return response.status(401).json(new ResponseMessage("Unauthorizated", ErrorCode.forBidden, {}));
  
  next();
}

export default verifyPermissionMiddleware;
