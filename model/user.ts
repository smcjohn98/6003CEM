import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize(`${config.databaseConnectionString}`);


const User = sequelize.define('user', {
  // Model attributes are defined here
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role:{
    type: DataTypes.STRING,
    allowNull: false
  },
  signup_code:{
    type: DataTypes.NUMBER,
    allowNull: true
  }
}, {
  // Other model options go here
});
export default User;