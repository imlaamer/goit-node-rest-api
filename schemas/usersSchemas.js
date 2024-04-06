import Joi from "joi";
import { emailRegex } from "../constants/common-constants.js";
import { starter, subscriptions } from "../constants/auth-constants.js";

export const userSignUpSchema = Joi.object({
  password: Joi.string().min(7).required().messages({
    "string.min": "Password must contain at least 7 symbols",
    "any.required": "Password is required",
  }),
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base":
      "Set a valid email in the format example@example.com",
    "any.required": "Email is required",
  }),
  subscription: Joi.string()
    .default(starter)
    .valid(...subscriptions)
    .messages({
      "any.only": `Choose a valid subscription: ${subscriptions.join(", ")}`,
    }),
  avatarURL: Joi.string(), //
});

export const userSignInSchema = Joi.object({
  password: Joi.string().min(7).required().messages({
    "string.min": "Password must contain at least 7 symbols",
    "any.required": "Password is required",
  }),
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base":
      "Enter a valid email in the format example@example.com",
    "any.required": "Email is required",
  }),
});

export const userSubscriptionUpdateSchema = Joi.object({
  subscription: Joi.string()
    .required()
    .valid(...subscriptions)
    .messages({
      "any.only": `Choose a valid subscription: ${subscriptions.join(", ")}`,
    }),
});

export const userEmailVerificationSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base":
      "Enter a valid email in the format example@example.com",
    "any.required": "Email is required",
  }),
});
