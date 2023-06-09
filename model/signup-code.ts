import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize('pet', 'root', '', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})

const SignupCode = sequelize.define('signupCode', {
  // Model attributes are defined here
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isValid: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  // Other model options go here
});

export default SignupCode;