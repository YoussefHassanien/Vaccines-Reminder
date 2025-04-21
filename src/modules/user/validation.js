// validation layer functions
import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";
