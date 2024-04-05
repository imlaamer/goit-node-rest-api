import bcrypt from "bcrypt";
import User from "../models/User.js";

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashedPassword });
};

export const findUser = (filter) => User.findOne(filter);

export const updateUser = (id, data) => User.findOneAndUpdate(id, data);

export const comparePasswords = (passwordForCheck, dbPassword) =>
  bcrypt.compare(passwordForCheck, dbPassword);
