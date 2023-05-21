import express, { Router, Request, Response, NextFunction } from 'express';
import ChatController from '../controller/chat-controller';
import { userValidator } from '../validator/user-validator'
import requestbodyValidator from '../validator/requestbody-validator'
import verifyTokenMiddleware from '../validator/jwt-validator';
import verifyPermissionMiddleware from '../validator/permission-validator';

const chatController = new ChatController;

export default class ChatRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/userlist', verifyTokenMiddleware(true), chatController.getUserList);
    this.router.get('/', verifyTokenMiddleware(true), chatController.getChat);
    this.router.post('/', verifyTokenMiddleware(true), chatController.sendChat);
    this.router.delete('/:id', verifyTokenMiddleware(true), verifyPermissionMiddleware(["admin, charity"]), chatController.delete);
  }
}