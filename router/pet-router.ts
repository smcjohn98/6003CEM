import express, { Router, Request, Response, NextFunction } from 'express';
import PetController from '../controller/pet-controller';
import { petValidator } from '../validator/pet-validator'
import requestbodyValidator from '../validator/requestbody-validator'
import verifyTokenMiddleware from '../validator/jwt-validator';
import verifyPermissionMiddleware from '../validator/permission-validator';

const multer = require('multer');
const upload = multer({ dest: 'images/' });

const petControllers = new PetController;

export default class PetRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() { 
    this.router.get('/', verifyTokenMiddleware(false), petControllers.getPets);
    this.router.get('/:id', verifyTokenMiddleware(false) , petControllers.getPet);
    this.router.post('/', verifyTokenMiddleware(true), verifyPermissionMiddleware(["charity", "admin"]), upload.single('image'), petValidator, requestbodyValidator, petControllers.insertPet);
    this.router.put('/:id', verifyTokenMiddleware(true), verifyPermissionMiddleware(["charity", "admin"]), upload.single('image'), petValidator, requestbodyValidator, petControllers.updatePet);
    this.router.delete('/:id', verifyTokenMiddleware(true), verifyPermissionMiddleware(["charity", "admin"]), petControllers.deletePet); 
  }
}