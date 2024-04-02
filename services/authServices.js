import bcrypt from "bcrypt";
import User from "../models/User.js";

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashedPassword });
};

export const findUser = (filter) => User.findOne(filter);

export const updateToken = (id, token) => User.findOneAndUpdate(id, token); //

export const comparePasswords = (passwordForCheck, dbPassword) =>
  bcrypt.compare(passwordForCheck, dbPassword);

export const updateUserSubscription = (id, subscription) =>
  User.findOneAndUpdate(id, subscription);
