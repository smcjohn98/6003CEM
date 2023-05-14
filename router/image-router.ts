import express, { Router, Request, Response, NextFunction } from 'express';
import ImageController from '../controller/image-controller';

const multer = require('multer');
const upload = multer({ dest: 'images/' });

const imageController = new ImageController;

export default class ImageRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/:imageName', imageController.getImage);
    this.router.post('/', upload.single('image'), imageController.uploadImage);
  }
}