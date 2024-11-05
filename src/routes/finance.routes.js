import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import {
  financeCreate,
  financeGetDetails,
  financeUpdate,
  InvestorDatatable,
  PayoutDatable,
} from "../api/Finance/Finance.controller.js";

const FinaceRoutes = express.Router();

FinaceRoutes.route("/create").post(tokenValidation, financeCreate);
FinaceRoutes.route("/update").post(tokenValidation, financeUpdate);
FinaceRoutes.route("/:id").get(tokenValidation, financeGetDetails);
FinaceRoutes.route("/investor/datatable").post(
  tokenValidation,
  InvestorDatatable
);
FinaceRoutes.route("/payout/datatable").post(tokenValidation, PayoutDatable);

export default FinaceRoutes;
