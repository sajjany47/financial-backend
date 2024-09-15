import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import { LeadGenerate } from "../api/loan/loan.controller.js";

const LoanRoutes = express.Router();

LoanRoutes.route("/lead-create").post(tokenValidation, LeadGenerate);

export default LoanRoutes;
