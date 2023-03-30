import { Request, Response, NextFunction } from 'express';
import Employee from '../model/employee';
import ResponseMessage, {ErrorCode} from '../bean/response-message'
import Bcrypt from 'bcrypt'
import { config } from '../config'
import JWT from 'jsonwebtoken';

export class EmployeeControllers {
  async getAllEmployee(request: Request, response: Response, next: NextFunction) {
    //Get All Employee
    let employees = await Employee.findAll();

    response.send(new ResponseMessage("OK", ErrorCode.noError, {employees:employees}));
  }

  async insertEmployee(request: Request, response: Response, next: NextFunction) {
    const {username, password} = request.body;

    // Check Username Existed
    const e = await Employee.findOne({where:{username:username}});
    if (e !== null){
      return response.status(404).json(new ResponseMessage("User Is Existed", ErrorCode.userNotExisted, {}));
    }
    
    const encryptPassword = Bcrypt.hashSync(password, 10);
    // Create User
    const a = await Employee.create({ username: username, password: encryptPassword })

    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async updateEmployee(request: Request, response: Response, next: NextFunction) {
    const {username, password} = request.body;

    // Check Username Existed
    const user = await Employee.findByPk(request.params.id);
    if (user === null){
      return response.status(404).json(new ResponseMessage("User Not Found", ErrorCode.userNotExisted, {}));
    }
    
    const encryptPassword = Bcrypt.hashSync(password, 10);
    // Create User
    user.setDataValue("password", encryptPassword);
    user.save();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async deleteEmployee(request: Request, response: Response, next: NextFunction) {
    
    // Check User Existed
    const user = await Employee.findByPk(request.params.id);
    if (user === null){
      return response.status(404).json(new ResponseMessage("User Not Found", ErrorCode.userNotExisted, {}));
    }
    
    //Delete User
    user.destroy();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const {username, password} = request.body;
    const user = await Employee.findOne({where:{username:username}});
    if (user === null){
      return response.status(404).json(new ResponseMessage("User Not Found", ErrorCode.userNotExisted, {}));
    }
    const match = Bcrypt.compareSync(password, user.getDataValue("password"));

    if(match){
      const jwt = JWT.sign({username:username, userId:user.getDataValue("id")}, config.jwtKey, { algorithm: 'HS256' });
      return response.status(200).json(new ResponseMessage("OK", ErrorCode.noError, {jwt:jwt}));
    }
    else
      return response.status(404).json(new ResponseMessage("Password Not Match", ErrorCode.passwordNotMatch, {}));
  }
}