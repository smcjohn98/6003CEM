import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize('pet', 'root', '', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})
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

  //Charity Information
  signupCode:{
    type: DataTypes.STRING,
    allowNull: true
  },
  location:{
    type: DataTypes.STRING,
    allowNull: true
  },
  phone:{
    type: DataTypes.STRING,
    allowNull: true
  },
  charityName:{
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  // Other model options go here
});
export default User;