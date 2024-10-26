import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import {
  financeCreate,
  financeDatatable,
  financeGetDetails,
  financeUpdate,
} from "../api/Finance/Finance.controller.js";

const FinaceRoutes = express.Router();

FinaceRoutes.route("/create").post(tokenValidation, financeCreate);
FinaceRoutes.route("/update").post(tokenValidation, financeUpdate);
FinaceRoutes.route("/:id").get(tokenValidation, financeGetDetails);
FinaceRoutes.route("/datatable").post(tokenValidation, financeDatatable);

export default FinaceRoutes;
