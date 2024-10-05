import express from "express";
import {
  chargesList,
  createCharges,
  statusChanges,
} from "../api/charges/charges.controller.js";
import { tokenValidation } from "../middleware/auth.middleware.js";

const ChargesRoutes = express.Router();

ChargesRoutes.route("/create").post(tokenValidation, createCharges);
ChargesRoutes.route("/status-change").post(tokenValidation, statusChanges);
ChargesRoutes.route("/list").get(tokenValidation, chargesList);

export default ChargesRoutes;
