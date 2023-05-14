import express, { Router, Request, Response, NextFunction } from 'express';
import UserController from '../controller/user-controller';
import { insertValidator } from '../validator/user-validator'
import verifyToken from '../validator/jwt-validator';
import requestbodyValidator from '../validator/requestbody-validator'
const userControllers = new UserController;

export default class UserRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', userControllers.getAll);
    this.router.get('/verify', verifyToken, userControllers.getUserData);
    this.router.post('/', insertValidator, requestbodyValidator, userControllers.insert);
    this.router.put('/:id', insertValidator, requestbodyValidator, userControllers.update);
    this.router.post('/login', insertValidator, requestbodyValidator, userControllers.login);
    this.router.delete('/:id', userControllers.delete);
  }
}