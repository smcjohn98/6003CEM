import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize('pet', 'root', '', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})

const Pet = sequelize.define('pet', {
  // Model attributes are defined here
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  thumbnail:{
    type: DataTypes.STRING,
    allowNull: true
  },
  gallery:{
    type: DataTypes.STRING,
    allowNull: true
  },
  description:{
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy:{
    type:DataTypes.INTEGER,
    allowNull: true
  }
}, {
  // Other model options go here
});
export default Pet;