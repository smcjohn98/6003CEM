import { Request, Response, NextFunction } from 'express';
import AuthenticatedRequest from '../type/AuthenticatedRequest';
import ResponseMessage, { ErrorCode } from '../bean/response-message';
import JWT from 'jsonwebtoken';
import { config } from '../config'

const verifyTokenMiddleware = (required: boolean) => {
  return (request:AuthenticatedRequest, response:Response, next:NextFunction) => 
    verifyToken(request, response, next, required);
}

function verifyToken(request:AuthenticatedRequest, response:Response, next:NextFunction, required: boolean) {
  const authorizationHeader = request.headers.authorization;

  if(!authorizationHeader && !required){
    next();
    return;
  }

  if(!authorizationHeader){
    return response.status(401).json(new ResponseMessage("Authorization Header Is Required", ErrorCode.forBidden, {}));
  }

  const token = authorizationHeader.split(' ')[1];

  JWT.verify(token, config.jwtKey, (err, decoded) => {
    console.log(decoded)

    if (err || typeof decoded !== 'object' || !decoded.role || !decoded.userId || !decoded.username || !decoded.name) {
      return response.status(401).json({ message: 'Invalid Jwt Token' });
    }

    request.user = {
      role: decoded.role,
      userId: decoded.userId,
      username: decoded.username,
      name: decoded.name
    }

    next();
  });
}

export default verifyTokenMiddleware;
