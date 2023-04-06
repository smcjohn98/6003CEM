import Employee from '../model/employee';
import Pet from '../model/pet';
import Bcrypt from 'bcrypt'

const dataInit = async () => {
  //Check Schema
  await Employee.sync()
  await Pet.sync()
  //TODO : Create Deault Data

  if (!await Employee.findOne({ where: { username: "admin" } })) {
    const adminPassword = Bcrypt.hashSync("P@ssw0rd", 10);
    Employee.create({ username: "admin", password: adminPassword })
  }
  if (!await Pet.findOne({ where: { name: "Peanut" } })) {
    Pet.create({ type: "cat", name: "Peanut", dob: "2021-12-15", breed: "DSH" })
  }
}

export { dataInit } 