import express from "express";
import {
  adminSignUpSchemaFirst,
  login,
  updateAccountDetails,
  updateDocumentDetails,
  updateEducationDetails,
} from "../api/user/user.controller.js";

const UserRoutes = express.Router();

UserRoutes.route("/login").post(login);
UserRoutes.route("/admin-signup").post(adminSignUpSchemaFirst);
UserRoutes.route("/update-education").post(updateEducationDetails);
UserRoutes.route("/update-document").post(updateDocumentDetails);
UserRoutes.route("/update-account").post(updateAccountDetails);

export default UserRoutes;
