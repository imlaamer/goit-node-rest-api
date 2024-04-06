import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import { starter } from "../constants/auth-constants.js";
import {
  comparePasswords,
  createUser,
  findUser,
  updateUser,
} from "../services/authServices.js";
import { sendVerificationEmail } from "../helpers/sendVerificationEmail.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");
//--------------------------------------------------------------
export const signUp = async (req, res, next) => {
  const { email, subscription = starter } = req.body;
  const findedUser = await findUser({ email });
  if (findedUser) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const verificationEmail = {
    to: email,
    subject: "Verify email",
    text: "Verificate your email, please",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify</a>`,
  };
  await sendVerificationEmail(verificationEmail);
  const newUser = await createUser({
    ...req.body,
    avatarURL,
    verificationToken,
  });
  res.status(201).json({
    email: newUser.email,
    subscription,
    avatarURL,
  });
};
//--------------------------------------------------------------
export const resendVerify = async (req, res, next) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verificationEmail = {
    to: email,
    subject: "Verify email",
    text: "Verificate your email, please",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify</a>`,
  };
  await sendVerificationEmail(verificationEmail);
  res.json({ message: "Verification email sent" });
};
//--------------------------------------------------------------
export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "VerificationToken not found"); //User not found
  }
  await updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "null" } //null ..
  );
  res.json({ message: "Verification successful" });
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
  if (!findedUser.verify) {
    throw HttpError(401, "Email not verify");
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
  await updateUser({ _id }, { token: null });
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
