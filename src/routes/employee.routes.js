import express from "express";
import {
  adminSignUpSchemaFirst,
  city,
  country,
  dataTable,
  detailsUpdateUser,
  getDetails,
  ifsc,
  login,
  logout,
  resetPassword,
  state,
  updateEducationAndCompanyDetails,
} from "../api/employess/employee.controller.js";
import {
  refreshTokens,
  tokenValidation,
} from "../middleware/auth.middleware.js";

const EmployeeRoutes = express.Router();

EmployeeRoutes.route("/refresh-token").get(refreshTokens);
EmployeeRoutes.route("/login").post(login);
EmployeeRoutes.route("/admin-signup").post(
  tokenValidation,
  adminSignUpSchemaFirst
);
EmployeeRoutes.route("/education-update").post(
  tokenValidation,
  updateEducationAndCompanyDetails
);
EmployeeRoutes.route("/country").get(tokenValidation, country);
EmployeeRoutes.route("/state/:country").get(tokenValidation, state);
EmployeeRoutes.route("/city").get(tokenValidation, city);
EmployeeRoutes.route("/ifsc/:code").get(tokenValidation, ifsc);
EmployeeRoutes.route("/update").post(tokenValidation, detailsUpdateUser);
EmployeeRoutes.route("/:id").get(getDetails);
EmployeeRoutes.route("/datatable").post(tokenValidation, dataTable);
EmployeeRoutes.route("/update-password").post(tokenValidation, resetPassword);
EmployeeRoutes.route("/logout").get(tokenValidation, logout);

export default EmployeeRoutes;
