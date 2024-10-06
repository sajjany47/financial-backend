import express from "express";
import {
  chargesList,
  createCharges,
  getCharges,
  statusChanges,
} from "../api/charges/charges.controller.js";
import { tokenValidation } from "../middleware/auth.middleware.js";

const ChargesRoutes = express.Router();

ChargesRoutes.route("/create").post(tokenValidation, createCharges);
ChargesRoutes.route("/status-change").post(tokenValidation, statusChanges);
ChargesRoutes.route("/list").get(tokenValidation, chargesList);
ChargesRoutes.route("/single-charges").get(tokenValidation, getCharges);

export default ChargesRoutes;
