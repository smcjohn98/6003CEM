import express, { Router, Request, Response, NextFunction } from 'express';
import WatchlistController from '../controller/watchlist-controller';
import { insertValidator } from '../validator/user-validator'
import requestbodyValidator from '../validator/requestbody-validator'

const watchlistControllers = new WatchlistController;

export default class WatchlistRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', watchlistControllers.getAll);
    this.router.post('/', watchlistControllers.insert);
    this.router.delete('/:id', watchlistControllers.delete);
  }
}