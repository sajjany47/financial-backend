import express from "express";
import { tokenValidation } from "../middleware/auth.middleware.js";
import { city, country, state } from "../api/Regional/Regional.controoler.js";

const RegionalRoutes = express.Router();

RegionalRoutes.route("/country").get(tokenValidation, country);
RegionalRoutes.route("/state/:country").get(tokenValidation, state);
RegionalRoutes.route("/city").get(tokenValidation, city);

export default RegionalRoutes;
