import express from "express";
import { adminSignUpSchemaFirst } from "../api/user/user.controller";

const userRoutes = express.Router();

userRoutes.route("/admin-signup", adminSignUpSchemaFirst);

export default userRoutes;
