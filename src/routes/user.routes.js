import express from "express";
import { adminSignUpSchemaFirst } from "../api/user/user.controller";

const UserRoutes = express.Router();

UserRoutes.route("/admin-signup").post(adminSignUpSchemaFirst);

export default UserRoutes;
