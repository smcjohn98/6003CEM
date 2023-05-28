import { Request, Response, NextFunction } from 'express';
import Pet from '../model/pet';
import ResponseMessage, { ErrorCode } from '../bean/response-message'
import { Sequelize }from 'sequelize';
import Watchlist from '../model/watchlist';
import AuthenticatedRequest from '../type/AuthenticatedRequest';
import User from '../model/user';
import { postTweet } from '../helper/tweet';

export default class PetController {
  async getPet(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    const userId = request.user?.userId;

    let pet = null;
    console.log(userId);
    if(userId){
      pet = await Pet.findOne({ where: {id:request.params.id},
        include: [{model: Watchlist, required:false, where:{userId:userId}},
          {model: User, attributes:['id', 'name', 'username', 'charityName', 'phone', 'location'] }
        ]
      });
    }
    else{
      pet = await Pet.findOne({ where: {id:request.params.id},
        include: [{model: User, attributes:['id', 'name', 'username', 'charityName', 'phone', 'location'] }]
      });
    }
    response.send(new ResponseMessage("OK", ErrorCode.noError, { pet: pet }));
  }
  async getPets(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    let { type, name, ageFrom, ageTo, breed, sex } = request.query;
    const userId = request.user?.userId;
    let limit : number = Number(request.query.limit)
    let offset : number = Number(request.query.offset)
    let fav : boolean = request.query.fav === 'true';
    let own : boolean = request.query.own === 'true';

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

    if(own && userId){
      criteria.createdBy = userId;
    }
    let pets = null;
    
    if(userId){
      pets = await Pet.findAndCountAll({ where: criteria, limit: limit, offset: offset, order: [["updatedAt", "desc"]], 
      include: {model: Watchlist, required:fav, where:{userId:userId}}
    });
    }
    else{
      pets = await Pet.findAndCountAll({ where: criteria, limit: limit, offset: offset, order: [["updatedAt", "desc"]], });
    }
    console.log(pets)
    response.send(new ResponseMessage("OK", ErrorCode.noError, { pet: pets.rows, count: pets.count }));
  }

  async insertPet(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    const { type, name, dob, breed, sex, description } = request.body;
    let postTwitter : boolean = request.body.postTwitter === 'true';
    
    const file = request.file;
    console.log(file);

    const a = await Pet.create({ type: type, name: name, dob: dob, breed: breed, thumbnail: file?.filename, sex: sex, createdBy: request.user?.userId, description: description })
    
    if(postTwitter){
      postTweet(file?.filename, name)
    }

    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async updatePet(request: Request, response: Response, next: NextFunction) {
    const { type, name, dob, breed, sex, description } = request.body;

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
    pet.setDataValue("description", description);

    if(file)
      pet.setDataValue('thumbnail', file?.filename)

    pet.save();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async deletePet(request: AuthenticatedRequest, response: Response, next: NextFunction) {

    // Check User Existed
    const pet = await Pet.findByPk(request.params.id);
    if (pet === null) {
      return response.status(404).json(new ResponseMessage("Pet Not Found", ErrorCode.resourceNotFound, {}));
    }

    if(request.user?.userId && request.user?.role === "charity" && pet.getDataValue("createdBy") !== request.user?.userId){
      return response.status(401).json(new ResponseMessage("Forbidden", ErrorCode.forBidden, {}));
    }
    //Delete User
    pet.destroy();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }
}