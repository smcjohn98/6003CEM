import { Request, Response, NextFunction } from 'express';
import Employee from '../model/employee';
import { validationResult } from 'express-validator';
import ResponseMessage from '../bean/response-message'

export class EmployeeControllers {
  async getAllEmployee(request: Request, response: Response, next: NextFunction) {
    let employees = await Employee.findAll();
    response.send(employees);
  }

  async insertEmployee(request: Request, response: Response, next: NextFunction) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    
    const a = await Employee.create({ username: request.body.username, password: request.body.password })
    response.send(a);
  }

  async Test(request: Request, response: Response, next: NextFunction) {
    let msg = new ResponseMessage('OK', 200, {employee:[]})
    response.json(msg)
  }
}