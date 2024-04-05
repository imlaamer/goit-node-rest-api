import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

export const setAvatarSize = async (req, res, next) => {
  if (!req.file) {
    return next(HttpError(400, "No avatar"));
  }
  const { path } = req.file;
  try {
    const file = await Jimp.read(path);
    await file.contain(250, 250).writeAsync(path); //set size and save
    next();
  } catch (err) {
    next(HttpError(400, err.message));
  }
};
