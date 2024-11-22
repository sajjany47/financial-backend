import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import { financialReport } from "../api/report/report.controller.js";

const ReportRoutes = express.Router();

ReportRoutes.route("/financial-year").post(tokenValidation, financialReport);

export default ReportRoutes;
