import express from "express";
import {
  adminSignUpSchemaFirst,
  city,
  country,
  dataTable,
  detailsUpdateUser,
  findIFSC,
  getDetails,
  login,
  logout,
  resetPassword,
  state,
  updateAccountDetails,
  updateBasicDetails,
  updateDocumentDetails,
  updateEducationAndCompanyDetails,
  updateEducationDetails,
} from "../api/employess/employee.controller.js";
import { tokenValidation } from "../middleware/auth.middleware.js";
import { refreshToken } from "../middleware/refreshToken.middleware.js";

const EmployeeRoutes = express.Router();

EmployeeRoutes.route("/refresh-token").post(tokenValidation, refreshToken);
EmployeeRoutes.route("/login").post(login);
EmployeeRoutes.route("/admin-signup").post(
  tokenValidation,
  adminSignUpSchemaFirst
);
EmployeeRoutes.route("/education-update").post(
  tokenValidation,
  updateEducationAndCompanyDetails
);
EmployeeRoutes.route("/update").post(tokenValidation, detailsUpdateUser);
EmployeeRoutes.route("/:id").get(tokenValidation, getDetails);
EmployeeRoutes.route("/datatable").post(tokenValidation, dataTable);
EmployeeRoutes.route("/update-education").post(
  tokenValidation,
  updateEducationDetails
);
EmployeeRoutes.route("/update-document").post(
  tokenValidation,
  updateDocumentDetails
);
EmployeeRoutes.route("/update-account").post(
  tokenValidation,
  updateAccountDetails
);
EmployeeRoutes.route("/update-basic").post(tokenValidation, updateBasicDetails);
EmployeeRoutes.route("/update-password").post(tokenValidation, resetPassword);
EmployeeRoutes.route("/logout").get(tokenValidation, logout);
EmployeeRoutes.route("/country").get(country);
EmployeeRoutes.route("/state").post(state);
EmployeeRoutes.route("/city").post(city);
EmployeeRoutes.route("/ifsc").post(tokenValidation, findIFSC);

export default EmployeeRoutes;
