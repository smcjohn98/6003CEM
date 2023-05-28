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

const userRegisterValidator = [
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
        .withMessage('Minimum 8 characters required!'),
    check('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Password can not be empty!'),
    check("isCharity").isBoolean().withMessage('isCharity can not be empty and is boolean!'),
    check("location").custom((value, { req }) => {
        if (req.body.isCharity && !value) {
            throw new Error("Location is required for charity");
        }
        return true;
    }),
    check("phone").custom((value, { req }) => {
        if (req.body.isCharity === true && !value) {
          throw new Error("Phone is required for charity");
        }
        return true;
      }),
    check("charityName").custom((value, { req }) => {
        if (req.body.isCharity === true && !value) {
            throw new Error("Charity name is required for charity");
        }
        return true;
    }),
]

export { userValidator, userRegisterValidator };