import { Request, Response, NextFunction } from 'express';
import User from '../model/user';
import ResponseMessage, { ErrorCode } from '../bean/response-message'
import Bcrypt from 'bcrypt'
import { config } from '../config'
import JWT from 'jsonwebtoken';

export default class UserController {
  async getAll(request: Request, response: Response, next: NextFunction) {
    //Get All
    let list = await User.findAll();

    response.send(new ResponseMessage("OK", ErrorCode.noError, { users: list }));
  }

  async insert(request: Request, response: Response, next: NextFunction) {
    const { username, password } = request.body;

    // Check Username Existed
    const e = await User.findOne({ where: { username: username } });
    if (e !== null) {
      return response.status(404).json(new ResponseMessage("User Is Existed", ErrorCode.resourceIsExisted, {}));
    }

    const encryptPassword = Bcrypt.hashSync(password, 10);
    // Create User
    const a = await User.create({ username: username, password: encryptPassword })

    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { username, password } = request.body;

    // Check Username Existed
    const user = await User.findByPk(request.params.id);
    if (user === null) {
      return response.status(404).json(new ResponseMessage("User Not Found", ErrorCode.resourceNotFound, {}));
    }

    const encryptPassword = Bcrypt.hashSync(password, 10);
    // Create User
    user.setDataValue("password", encryptPassword);
    user.save();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async delete(request: Request, response: Response, next: NextFunction) {

    // Check User Existed
    const user = await User.findByPk(request.params.id);
    if (user === null) {
      return response.status(404).json(new ResponseMessage("User Not Found", ErrorCode.resourceNotFound, {}));
    }

    //Delete User
    user.destroy();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { username, password } = request.body;
    const user = await User.findOne({ where: { username: username } });
    if (user === null) {
      return response.status(404).json(new ResponseMessage("User Not Found", ErrorCode.resourceNotFound, {}));
    }
    const match = Bcrypt.compareSync(password, user.getDataValue("password"));

    if (match) {
      const jwt = JWT.sign({ username: username, userId: user.getDataValue("id") }, config.jwtKey, { algorithm: 'HS256' });
      return response.status(200).json(new ResponseMessage("OK", ErrorCode.noError, { jwt: jwt }));
    }
    else
      return response.status(404).json(new ResponseMessage("Password Not Match", ErrorCode.passwordNotMatch, {}));
  }
}