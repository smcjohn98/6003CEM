import { check, validationResult } from 'express-validator';

const insertValidator = check('username')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .bail()
    .isLength({min: 8})
    .withMessage('Minimum 8 characters required!');

export default insertValidator;