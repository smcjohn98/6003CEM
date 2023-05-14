import { Request, Response, NextFunction } from 'express';
import ResponseMessage, { ErrorCode } from '../bean/response-message'
import fs from 'fs'

const multer = require('multer');
const upload = multer({ dest: 'images/' });

export default class ImageController {
  async uploadImage(request: Request, response: Response, next: NextFunction) {
    const file = request.file;
    console.log(file);

    response.send(new ResponseMessage("OK", ErrorCode.noError, {filename: file?.filename, size: file?.size, mimetype: file?.mimetype}));
  }

  async getImage(request: Request, response: Response, next: NextFunction) {
    try{
      const imageName = request.params.imageName;
      const readStream = fs.createReadStream(`images/${imageName}`);
      readStream.pipe(response);
    }
    catch(e){
      console.log(e);
      response.send("Error");
    }
  }
}