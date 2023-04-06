import { Request, Response, NextFunction } from 'express';
import Pet from '../model/pet';
import ResponseMessage, { ErrorCode } from '../bean/response-message'
import { Sequelize } from 'sequelize';

export default class PetController {
  async getPets(request: Request, response: Response, next: NextFunction) {
    let { type, name, ageFrom, ageTo, breed, limit, offset } = request.query;

    if(!limit)
      limit = 12
    if(!offset)
      offset = 0
    
    let criteria: { [key: string]: any } = {};

    if (type) {
      criteria.type = type;
    }
    if (name) {
      criteria.name = Sequelize.literal(`LOWER(name) LIKE LOWER('%${name}%')`)
    }
    if (breed) {
      criteria.breed = breed;
    }
    if (ageFrom) {
      const ageForWhere = Sequelize.literal(`AGE(DOB) >= INTERVAL '${ageFrom} year'`)
      criteria.ageFrom = ageForWhere;
    }
    if (ageTo) {
      const ageToWhere = Sequelize.literal(`AGE(DOB) < INTERVAL '${Number(ageTo) + 1} year'`)
      criteria.ageTo = ageToWhere;
    }
    
    const pets = await Pet.findAll({ where: criteria, limit: limit, offset: offset, attributes:{include:[
      Sequelize.literal('AGE(DOB) as age')
    ]}});
    //const pets = await Pet.findAll({ where: criteria });
    response.send(new ResponseMessage("OK", ErrorCode.noError, { pet: pets }));
  }

  async insertPet(request: Request, response: Response, next: NextFunction) {
    const { type, name, dob, breed } = request.body;

    const a = await Pet.create({ type: type, name: name, dob: dob, breed: breed })

    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async updatePet(request: Request, response: Response, next: NextFunction) {
    const { type, name, dob, breed } = request.body;

    // Check Username Existed
    const pet = await Pet.findByPk(request.params.id);

    if (pet === null) {
      return response.status(404).json(new ResponseMessage("Pet Not Found", ErrorCode.resourceNotFound, {}));
    }
    // Create User
    pet.setDataValue("type", type)
    pet.setDataValue("name", name)
    pet.setDataValue("dob", dob)
    pet.setDataValue("breed", breed)

    pet.save();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async deletePet(request: Request, response: Response, next: NextFunction) {

    // Check User Existed
    const pet = await Pet.findByPk(request.params.id);
    if (pet === null) {
      return response.status(404).json(new ResponseMessage("Pet Not Found", ErrorCode.resourceNotFound, {}));
    }

    //Delete User
    pet.destroy();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }
}