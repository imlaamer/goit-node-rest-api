import express from "express";
import {
  userSignInSchema,
  userSignUpSchema,
  userSubscriptionUpdateSchema,
} from "../schemas/usersSchemas.js";
import {
  getCurrent,
  signIn,
  signOut,
  signUp,
  updateUserAvatar,
  updateSubscription,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { setAvatarSize } from "../middlewares/setAvatarSize.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import validateBody from "../helpers/validateBody.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSignUpSchema),
  ctrlWrapper(signUp)
);

authRouter.post("/login", validateBody(userSignInSchema), ctrlWrapper(signIn));

authRouter.post("/logout", authenticate, ctrlWrapper(signOut));

authRouter.get("/current", authenticate, getCurrent);

authRouter.patch(
  "/",
  validateBody(userSubscriptionUpdateSchema),
  authenticate,
  ctrlWrapper(updateSubscription)
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  setAvatarSize,
  ctrlWrapper(updateUserAvatar)
);

export default authRouter;
