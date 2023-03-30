import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const requestbodyValidator = (request: Request, response: Response, next: NextFunction) => {
    //Skip next and throw error if validation error
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    next()
}
export default requestbodyValidator;
