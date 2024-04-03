import { Schema, model } from "mongoose";
import { subscriptions, starter } from "../constants/auth-constants.js";
import { emailRegex } from "../constants/common-constants.js";
import { passwordRegex } from "../constants/auth-constants.js";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [passwordRegex, "Email must contain at least 7 symbols"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [emailRegex, "Enter email in the format example@example.com"],
    },
    subscription: {
      type: String,
      enum: subscriptions,
      default: starter,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);
export default User;
