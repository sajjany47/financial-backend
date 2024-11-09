import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import {
  financeCreate,
  financeGetDetails,
  financePayNow,
  financeReedemApply,
  financeUpdate,
  InvestorDatatable,
  PayoutDatable,
  ReedemDatable,
} from "../api/Finance/Finance.controller.js";

const FinaceRoutes = express.Router();

FinaceRoutes.route("/create").post(tokenValidation, financeCreate);
FinaceRoutes.route("/update").post(tokenValidation, financeUpdate);
FinaceRoutes.route("/:id").get(tokenValidation, financeGetDetails);
FinaceRoutes.route("/pay-now").post(tokenValidation, financePayNow);
FinaceRoutes.route("/reedem-apply").post(tokenValidation, financeReedemApply);
FinaceRoutes.route("/investor/datatable").post(
  tokenValidation,
  InvestorDatatable
);
FinaceRoutes.route("/payout/datatable").post(tokenValidation, PayoutDatable);
FinaceRoutes.route("/reedem/datatable").post(tokenValidation, ReedemDatable);

export default FinaceRoutes;
