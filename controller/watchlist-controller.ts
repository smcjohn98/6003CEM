import { Request, Response, NextFunction } from 'express';
import Watchlist from '../model/watchlist';
import ResponseMessage, { ErrorCode } from '../bean/response-message'

export default class WatchlistController {
  async getAll(request: Request, response: Response, next: NextFunction) {
    //Get All
    let watchlist = await Watchlist.findAll();

    response.send(new ResponseMessage("OK", ErrorCode.noError, { watchlist: watchlist }));
  }

  async insert(request: Request, response: Response, next: NextFunction) {
    const { user_id, pet_id } = request.body;

    // Check Existed
    const e = await Watchlist.findOne({ where: { user_id: user_id, pet_id: pet_id } });
    if (e !== null) {
      return response.status(404).json(new ResponseMessage("Watchlist Item Is Existed", ErrorCode.resourceIsExisted, {}));
    }
 
    // Create User
    const a = await Watchlist.create({ user_id: user_id, pet_id: pet_id })

    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }

  async delete(request: Request, response: Response, next: NextFunction) {

    // Check User Existed
    const watchlist = await Watchlist.findByPk(request.params.id);
    if (watchlist === null) {
      return response.status(404).json(new ResponseMessage("Watchlist Item Not Found", ErrorCode.resourceNotFound, {}));
    }

    //Delete User
    watchlist.destroy();
    response.send(new ResponseMessage("OK", ErrorCode.noError, {}));
  }
}