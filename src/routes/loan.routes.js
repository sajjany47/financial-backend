import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import {
  ApplicationCreate,
  ApplicationUpdate,
  datatable,
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
LoanRoutes.route("/:id").get(tokenValidation, getLoanDetail);

LoanRoutes.route("/datatable").post(tokenValidation, datatable);

export default LoanRoutes;
