import express, { Router, Request, Response, NextFunction } from 'express';
import UserController from '../controller/user-controller';
import { userValidator } from '../validator/user-validator'
import requestbodyValidator from '../validator/requestbody-validator'
import verifyTokenMiddleware from '../validator/jwt-validator';
import verifyPermissionMiddleware from '../validator/permission-validator';

const userControllers = new UserController;

export default class UserRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', verifyTokenMiddleware(true), verifyPermissionMiddleware(["admin"]), userControllers.getAll);
    this.router.get('/verify', verifyTokenMiddleware(true), userControllers.getUserData);
    this.router.post('/', userValidator, requestbodyValidator, userControllers.insert);
    this.router.put('/:id', verifyTokenMiddleware(true), userValidator, requestbodyValidator, userControllers.update);
    this.router.post('/login', userValidator, requestbodyValidator, userControllers.login);
    this.router.delete('/:id', verifyTokenMiddleware(true), verifyPermissionMiddleware(["admin"]), userControllers.delete);
  }
}