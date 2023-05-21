import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';
import Pet from './pet';
import User from './user';

//const sequelize = new Sequelize(`${config.databaseConnectionString}`);
const sequelize = new Sequelize('pet', 'root', '', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})
//const sequelize = new Sequelize(`${config.databaseConnectionString}`);
const Watchlist = sequelize.define('watchlist', {
  // Model attributes are defined here
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pet_id: {
    type: DataTypes.INTEGER, 
    allowNull: false
  }
});

export default Watchlist;