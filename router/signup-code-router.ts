import express, { Router, Request, Response, NextFunction } from 'express';
import SignupCodeController from '../controller/signup-code-controller';
import requestbodyValidator from '../validator/requestbody-validator'
import verifyTokenMiddleware from '../validator/jwt-validator';
import verifyPermissionMiddleware from '../validator/permission-validator';

const signupCodeControllers = new SignupCodeController;

export default class SignupCodeRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', verifyTokenMiddleware(true), verifyPermissionMiddleware(["admin"]), signupCodeControllers.getAll);
    this.router.post('/', verifyTokenMiddleware(true), verifyPermissionMiddleware(["admin"]) , signupCodeControllers.insert);
    this.router.delete('/:id', verifyTokenMiddleware(true), verifyPermissionMiddleware(["admin"]), signupCodeControllers.delete);
  }
}