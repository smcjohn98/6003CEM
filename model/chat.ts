import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize('pet', 'root', '', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})

const Chat = sequelize.define('chat', {
  // Model attributes are defined here
  user_from: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_to: {
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  message:{
    type: DataTypes.TEXT,
    allowNull: false
  }
  // Other model options go here
});
export default Chat;