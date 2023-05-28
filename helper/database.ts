import User from '../model/user';
import Pet from '../model/pet';
import Watchlist from '../model/watchlist';
import SignupCode from '../model/signup-code';
import Chat from '../model/chat';
import Bcrypt from 'bcrypt'
import UserRole from '../enum/user-role';
import { config } from '../config';
import { Sequelize } from 'sequelize';

//const sequelize = new Sequelize(`${config.databaseConnectionString}`)
const sequelize = new Sequelize('pet', 'root', '', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})

const dataInit = async () => {
  //Check Schema
  await User.sync()
  await Pet.sync()
  await SignupCode.sync()
  await Watchlist.sync()
  await Chat.sync()

  User.hasMany(Watchlist, {foreignKey: "userId"})
  Watchlist.belongsTo(User, {foreignKey: "id"})

  User.hasMany(Pet, {foreignKey: "createdBy"})
  Pet.belongsTo(User, {foreignKey: "createdBy"})

  Pet.hasMany(Watchlist, {foreignKey: "petId"})
  Watchlist.belongsTo(User, {foreignKey: "id"})

  if (!await User.findOne({ where: { username: "admin@gmail.com" } })) {
    const adminPassword = Bcrypt.hashSync("P@ssw0rd", 10);
    User.create({ username: "admin@gmail.com", password: adminPassword, name: 'Admin User', role: UserRole.Admin })
  }
  /*if (!await Pet.findOne({ where: { name: "Peanut" } })) {
    Pet.create({ type: "cat", name: "Peanut", sex: 'F', dob: "2021-12-15", breed: "abys" })
  } */

  /*if (!await Watchlist.findOne({ where: { userId:1, petId:1 } })) {
    Watchlist.create({userId:1, petId:1})
  } */

  /*const e = await User.findOne({where:{id:1}, include:{model:Watchlist} });
  console.log(e?.getDataValue("watchlists"));*/
}

export { dataInit, sequelize } 