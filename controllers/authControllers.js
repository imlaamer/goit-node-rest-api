import jwt from "jsonwebtoken";
import { starter } from "../constants/auth-constants.js";
import HttpError from "../helpers/HttpError.js";
import {
  comparePasswords,
  createUser,
  findUser,
  updateToken,
  updateUserSubscription,
} from "../services/authServices.js";

const { JWT_SECRET } = process.env;

export const signUp = async (req, res, next) => {
  const { email, subscription = starter } = req.body;
  const findedUser = await findUser({ email });
  if (findedUser) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await createUser(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription,
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
  await updateToken({ _id: id }, { token });
  res.json({ token, user: { email, subscription: findedUser.subscription } });
};
//--------------------------------------------------------------
export const signOut = async (req, res, next) => {
  const { _id } = req.user;
  await updateToken({ _id }, { token: null }); //
  res.status(204).json({});
};
//--------------------------------------------------------------
export const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await updateUserSubscription({ _id }, { subscription });
  res.json({ subscription });
};
