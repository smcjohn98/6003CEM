import { Request, Response, NextFunction } from 'express';
import Pet from '../model/pet';
import ResponseMessage, { ErrorCode } from '../bean/response-message'
import { Sequelize }from 'sequelize';
import Watchlist from '../model/watchlist';
import AuthenticatedRequest from '../type/AuthenticatedRequest';

export default class PetController {
  async getPets(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    let { type, name, ageFrom, ageTo, breed, sex, userId } = request.query;
    let limit : number = Number(request.query.limit)
    let offset : number = Number(request.query.offset)
    let fav : boolean = request.query.fav === 'true';
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
    if (sex) {
      criteria.sex = sex;
    }
    if (ageFrom) {
      const ageForWhere = Sequelize.literal(`AGE(DOB) >= INTERVAL '${ageFrom} year'`)
      criteria.ageFrom = ageForWhere;
    }
    if (ageTo) {
      const ageToWhere = Sequelize.literal(`AGE(DOB) < INTERVAL '${Number(ageTo) + 1} year'`)
      criteria.ageTo = ageToWhere;
    }

    let pets = null;
    
    if(userId){
      pets = await Pet.findAll({ where: criteria, limit: limit, offset: offset, order: [["updatedAt", "desc"]], 
      include: {model: Watchlist, required:fav, where:{user_id:userId}}
    });
    }
    else{
      pets = await Pet.findAll({ where: criteria, limit: limit, offset: offset, order: [["updatedAt", "desc"]], });
    }
    response.send(new ResponseMessage("OK", ErrorCode.noError, { pet: pets }));
  }

  async insertPet(request: Request, response: Response, next: NextFunction) {
    const { type, name, dob, breed, sex } = request.body;

    const file = request.file;
    console.log(file);

    const a = await Pet.create({ type: type, name: name, dob: dob, breed: breed, thumbnail: file?.filename, sex: sex })

    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async updatePet(request: Request, response: Response, next: NextFunction) {
    const { type, name, dob, breed, sex } = request.body;

    const file = request.file;
    console.log(file);

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
    pet.setDataValue("sex", sex)
    if(file)
      pet.setDataValue('thumbnail', file?.filename)

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