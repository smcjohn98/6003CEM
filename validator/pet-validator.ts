import { check } from 'express-validator';

const petValidator = [
  check('type')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Type can not be empty!'),
  check('name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Name can not be empty!'),
  check('breed')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Breed can not be empty!'),
  check('dob')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Dob can not be empty!')
    .bail()
    .isISO8601()
    .withMessage('Dob wrong format!'),
  check('sex')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Sex can not be empty!')
    .bail()
    .isIn(['F', 'M'])
    .withMessage('Invalid Sex!')
    
]

export { petValidator };