import express, { Router, Request, Response, NextFunction } from 'express';
import SignupCodeController from '../controller/signup-code-controller';
import { insertValidator } from '../validator/user-validator'
import requestbodyValidator from '../validator/requestbody-validator'

const signupCodeControllers = new SignupCodeController;

export default class SignupCodeRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', signupCodeControllers.getAll);
    this.router.post('/', signupCodeControllers.insert);
    this.router.delete('/:id', signupCodeControllers.delete);
  }
}