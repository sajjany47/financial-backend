import express from "express";
import {
  adminSignUpSchemaFirst,
  city,
  country,
  findIFSC,
  login,
  logout,
  resetPassword,
  state,
  updateAccountDetails,
  updateBasicDetails,
  updateDocumentDetails,
  updateEducationDetails,
} from "../api/user/user.controller.js";
import { tokenValidation } from "../middleware/auth.middleware.js";
import { refreshToken } from "../middleware/refreshToken.middleware.js";

const UserRoutes = express.Router();

UserRoutes.route("/refresh-token").post(tokenValidation, refreshToken);
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
UserRoutes.route("/update-basic").post(tokenValidation, updateBasicDetails);
UserRoutes.route("/update-password").post(tokenValidation, resetPassword);
UserRoutes.route("/logout").get(tokenValidation, logout);
UserRoutes.route("/country").get(tokenValidation, country);
UserRoutes.route("/state").post(tokenValidation, state);
UserRoutes.route("/city").post(tokenValidation, city);
UserRoutes.route("/ifsc").post(tokenValidation, findIFSC);

export default UserRoutes;
