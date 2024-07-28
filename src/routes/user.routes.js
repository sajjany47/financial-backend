import express from "express";
import {
  adminSignUpSchemaFirst,
  login,
  resetPassword,
  updateAccountDetails,
  updateDocumentDetails,
  updateEducationDetails,
} from "../api/user/user.controller.js";
import { tokenValidation } from "../middleware/auth.middleware.js";
import { refreshToken } from "../middleware/refreshToken.middleware.js";

const UserRoutes = express.Router();

UserRoutes.route("/refresh-token").post(refreshToken);
UserRoutes.route("/login").post(login);
UserRoutes.route("/admin-signup").post(tokenValidation, adminSignUpSchemaFirst);
UserRoutes.route("/update-education").post(
  tokenValidation,
  updateEducationDetails
);
UserRoutes.route("/update-document").post(
  tokenValidation,
  updateDocumentDetails
);
UserRoutes.route("/update-account").post(tokenValidation, updateAccountDetails);
UserRoutes.route("/update-password").post(tokenValidation, resetPassword);

export default UserRoutes;
