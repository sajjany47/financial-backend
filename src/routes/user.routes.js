import express from "express";
import { adminSignUpSchemaFirst } from "../api/user/user.controller.js";

const UserRoutes = express.Router();

UserRoutes.route("/admin-signup").post(adminSignUpSchemaFirst);

export default UserRoutes;
