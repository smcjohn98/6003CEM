import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Chat from '../model/chat';
import User from '../model/user';
import { sequelize } from '../helper/database';
import ResponseMessage, { ErrorCode } from '../bean/response-message'
import AuthenticatedRequest from '../type/AuthenticatedRequest';

export default class ChatController {

  async getUserList(request: AuthenticatedRequest, response: Response, next: NextFunction) {

    if(!request.user)
      return response.status(401).json(new ResponseMessage("Unauthorizated", ErrorCode.resourceNotFound, {}));

    const list = await sequelize.query(
      "SELECT DISTINCT u.id as userId, u.name as userName FROM chats c, users u WHERE (c.userFrom = ? or c.userTo = ?) and u.id <> ? and u.id in (c.userFrom, c.userTo)",
      {
        replacements: [request.user.userId, request.user.userId, request.user.userId]
      }
    );

    console.log(list);

    response.send(new ResponseMessage("OK", ErrorCode.noError, { users: list[0] }));
  }

  async getChat(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    const { chatUser } = request.query;
    if(!request.user)
      return response.status(401).json(new ResponseMessage("Unauthorizated", ErrorCode.resourceNotFound, {}));

    const list = await sequelize.query(
      "SELECT * FROM chats c WHERE (c.userFrom = ? and c.userTo = ?) or (c.userFrom = ? and c.userTo = ?) order by createdAt asc",
      {
        replacements: [chatUser, request.user.userId, request.user.userId, chatUser]
      }
    );

    response.send(new ResponseMessage("OK", ErrorCode.noError, { chats: list[0] }));
  }

  async sendChat(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    const { userTo, message } = request.body;
  
    if(userTo == request.user?.userId)
      return response.status(404).json(new ResponseMessage("UserFrom and UserTo cannot be the same", ErrorCode.bodyBadRequest, {}));
    // Check Username Existed
    const e = await User.findOne({ where: { id: userTo } });
    if (e === null) {
      return response.status(404).json(new ResponseMessage("UserTo Not Existed", ErrorCode.resourceNotFound, {}));
    }

    const msg = await Chat.create({userFrom: request?.user?.userId, userTo: userTo, message: message})
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const chat = await Chat.findByPk(request.params.id);
    if (chat === null) {
      return response.status(404).json(new ResponseMessage("Chat Not Found", ErrorCode.resourceNotFound, {}));
    }

    //Delete User
    chat.destroy();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }
}