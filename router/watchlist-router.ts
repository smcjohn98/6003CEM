import express, { Router, Request, Response, NextFunction } from 'express';
import WatchlistController from '../controller/watchlist-controller';
import verifyTokenMiddleware from '../validator/jwt-validator';
import verifyPermissionMiddleware from '../validator/permission-validator';

const watchlistControllers = new WatchlistController;

export default class WatchlistRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', verifyTokenMiddleware(true), verifyPermissionMiddleware(["admin"]), watchlistControllers.getAll);
    this.router.post('/', verifyTokenMiddleware(true), watchlistControllers.insert);
    this.router.delete('/:id', verifyTokenMiddleware(true), watchlistControllers.delete);
  }
}