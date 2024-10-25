import express from "express";
import {
  adminSignUpSchemaFirst,
  dataTable,
  detailsUpdateUser,
  EmployeeView,
  getDetails,
  ifsc,
  login,
  logout,
  resetPassword,
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
EmployeeRoutes.route("/logout").get(tokenValidation, logout);

EmployeeRoutes.route("/ifsc/:code").get(tokenValidation, ifsc);
EmployeeRoutes.route("/update").post(tokenValidation, detailsUpdateUser);
EmployeeRoutes.route("/:id").get(tokenValidation, getDetails);
EmployeeRoutes.route("/view/:id").get(tokenValidation, EmployeeView);
EmployeeRoutes.route("/datatable").post(tokenValidation, dataTable);
EmployeeRoutes.route("/update-password").post(tokenValidation, resetPassword);

export default EmployeeRoutes;
