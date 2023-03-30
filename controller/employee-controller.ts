import { Request, Response, NextFunction } from 'express';
import Employee from '../model/employee';
import ResponseMessage, {ErrorCode} from '../bean/response-message'

export class EmployeeControllers {
  async getAllEmployee(request: Request, response: Response, next: NextFunction) {
    //Get All Employee
    let employees = await Employee.findAll();
    response.send(employees);
  }

  async insertEmployee(request: Request, response: Response, next: NextFunction) {
    const {username, password} = request.body;

    // Check Username Existed
    const e = await Employee.findOne({where:{username:username}});
    if (e !== null){
      return response.status(400).json("")
    }
    
    // Create User
    const a = await Employee.create({ username: username, password: password })
    response.send(a);
  }

  async Test(request: Request, response: Response, next: NextFunction) {
    let msg = new ResponseMessage('OK', ErrorCode.noError, {employee:[]})
    response.json(msg)
  }
}