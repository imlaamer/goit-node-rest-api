import express from "express";
import {
  userSignInSchema,
  userSignUpSchema,
  userSubscribtionUpdate,
} from "../schemas/usersSchemas.js";
import {
  getCurrent,
  signIn,
  signOut,
  signUp,
  updateSubscription,
} from "../controllers/authControllers.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import validateBody from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

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
  validateBody(userSubscribtionUpdate),
  authenticate,
  ctrlWrapper(updateSubscription)
);

export default authRouter;
