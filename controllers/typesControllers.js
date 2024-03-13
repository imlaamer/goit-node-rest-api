import * as typesServices from "../services/typesServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAll = async (_, res) => {
  const result = await typesServices.getAllTypes();
  res.json(result);
};

export const add = async (req, res) => {
  const result = await typesServices.addType(req.body);
  res.status(201).json(result);
};
