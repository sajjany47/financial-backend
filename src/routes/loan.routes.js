import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import {
  ApplicationCreate,
  applicationDelete,
  ApplicationUpdate,
  datatable,
  documentDelete,
  documentUpdate,
  documentUpload,
  getEMIDetails,
  getLoanDetail,
} from "../api/loan/loan.controller.js";

const LoanRoutes = express.Router();

LoanRoutes.route("/application-create").post(
  tokenValidation,
  ApplicationCreate
);
LoanRoutes.route("/application-update").post(
  tokenValidation,
  ApplicationUpdate
);
LoanRoutes.route("/application-document").post(tokenValidation, documentUpload);
LoanRoutes.route("/document-update").post(tokenValidation, documentUpdate);
LoanRoutes.route("/document-delete").post(tokenValidation, documentDelete);
LoanRoutes.route("/application-delete").post(
  tokenValidation,
  applicationDelete
);
LoanRoutes.route("/:id").get(tokenValidation, getLoanDetail);
LoanRoutes.route("/emi-details").post(tokenValidation, getEMIDetails);
LoanRoutes.route("/datatable").post(tokenValidation, datatable);

export default LoanRoutes;
