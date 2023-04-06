import express, { Router, Request, Response, NextFunction } from 'express';
import PetController from '../controller/pet-controller';
import { petValidator } from '../validator/pet-validator'
import requestbodyValidator from '../validator/requestbody-validator'

const petControllers = new PetController;

export default class PetRouter {
  router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', petControllers.getPets);
    this.router.post('/', petValidator, requestbodyValidator, petControllers.insertPet);
    this.router.put('/:id', petValidator, requestbodyValidator, petControllers.updatePet);
    this.router.delete('/:id', petControllers.deletePet);
  }
}