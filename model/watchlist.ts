import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize(`${config.databaseConnectionString}`);


const Watchlist = sequelize.define('signup_code', {
  // Model attributes are defined here
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pet_id: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  // Other model options go here
});
export default Watchlist;