import express from "express";
import * as typesController from "../controllers/typesControllers.js";
import validateBody from "../helpers/validateBody.js";
import { typeAddSchema } from "../schemas/typeSchema.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const typesRouter = express.Router();

typesRouter.get("/", ctrlWrapper(typesController.getAll));
typesRouter.post(
  "/",
  validateBody(typeAddSchema),
  ctrlWrapper(typesController.add)
);

export default typesRouter;
