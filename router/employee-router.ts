import express, { Router, Request, Response, NextFunction } from 'express';
import EmployeeController from '../controller/employee-controller';
import { insertValidator } from '../validator/employee-validator'
import requestbodyValidator from '../validator/requestbody-validator'

const employeeControllers = new EmployeeController;

export default class EmployeeRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', employeeControllers.getAllEmployee);
    this.router.post('/', insertValidator, requestbodyValidator, employeeControllers.insertEmployee);
    this.router.put('/:id', insertValidator, requestbodyValidator, employeeControllers.updateEmployee);
    this.router.post('/login', insertValidator, requestbodyValidator, employeeControllers.login);
    this.router.delete('/:id', employeeControllers.deleteEmployee);
  }
}