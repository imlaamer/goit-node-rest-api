import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";
import { starter } from "../constants/auth-constants.js";
import {
  comparePasswords,
  createUser,
  findUser,
  updateUser,
} from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");
//--------------------------------------------------------------
export const signUp = async (req, res, next) => {
  const { email, subscription = starter } = req.body;
  const findedUser = await findUser({ email });
  if (findedUser) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email); //
  const newUser = await createUser({ ...req.body, avatarURL });
  res.status(201).json({
    email: newUser.email,
    subscription,
    avatarURL,
  });
};
//--------------------------------------------------------------
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const findedUser = await findUser({ email });
  if (!findedUser) {
    throw HttpError(401, "Email or password is wrong");
  }
  const isPasswordRight = await comparePasswords(password, findedUser.password);
  if (!isPasswordRight) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = findedUser;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await updateUser({ _id: id }, { token });
  res.json({ token, user: { email, subscription: findedUser.subscription } });
};
//--------------------------------------------------------------
export const signOut = async (req, res, next) => {
  const { _id } = req.user;
  await updateUser({ _id }, { token: null }); //
  res.status(204).json({});
};
//--------------------------------------------------------------
export const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};
//--------------------------------------------------------------
export const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await updateUser({ _id }, { subscription });
  res.json({ subscription });
};
//--------------------------------------------------------------
export const updateUserAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatar = path.join("avatars", filename);
  await updateUser({ _id }, { avatarURL: avatar });
  res.json({ avatarURL: avatar });
};
