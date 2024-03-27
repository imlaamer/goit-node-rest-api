import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegex } from "../constants/common-constants.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: [
        emailRegex,
        "Set a valid email address in the format example@example.com",
      ],
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId, //
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);
export default Contact;
