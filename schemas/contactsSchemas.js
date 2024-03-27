import Joi from "joi";
import { emailRegex } from "../constants/common-constants.js";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .required()
    .pattern(emailRegex)
    .message("Set a valid email in the format example@example.com"),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string()
    .pattern(emailRegex)
    .message("Set a valid email in the format example@example.com"),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).min(1);

export const updateContactStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
