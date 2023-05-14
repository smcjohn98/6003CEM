import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize(`${config.databaseConnectionString}`);


const SignupCode = sequelize.define('signup_code', {
  // Model attributes are defined here
  code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  create_by:{
    type: DataTypes.NUMBER,
    allowNull: true
  }
}, {
  // Other model options go here
});
export default SignupCode;