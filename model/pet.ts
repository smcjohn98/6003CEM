import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize(`${config.databaseConnectionString}`);


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
  dob: {
    type: DataTypes.DATE,
    allowNull: false
  },
  thumbnail:{
    type: DataTypes.STRING,
    allowNull: true
  },
  gallery:{
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Other model options go here
});
export default Pet;