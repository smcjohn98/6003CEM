import { check } from 'express-validator';

const userValidator = [
    check('username')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Username can not be empty!')
        .bail()
        .isLength({min: 8})
        .withMessage('Minimum 8 characters required!'),
    check('password')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Password can not be empty!')
        .bail()
        .isLength({min: 8})
        .withMessage('Minimum 8 characters required!')
]

export { userValidator };