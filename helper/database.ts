import User from '../model/user';
import Pet from '../model/pet';
import Watchlist from '../model/watchlist';
import SignupCode from '../model/signup-code';
import Bcrypt from 'bcrypt'
import UserRole from '../enum/user-role';

const dataInit = async () => {
  //Check Schema
  await User.sync()
  await Pet.sync()
  await SignupCode.sync()
  await Watchlist.sync()
  //TODO : Create Deault Data

  if (!await User.findOne({ where: { username: "test_admin" } })) {
    const adminPassword = Bcrypt.hashSync("P@ssw0rd", 10);
    User.create({ username: "test_admin", password: adminPassword, name: 'Admin User', role: UserRole.Admin })
  }
  if (!await Pet.findOne({ where: { name: "Peanut" } })) {
    Pet.create({ type: "cat", name: "Peanut", dob: "2021-12-15", breed: "DSH" })
  }
}

export { dataInit } 