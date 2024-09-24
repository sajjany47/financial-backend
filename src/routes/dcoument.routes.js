import express from "express";
import { tokenValidation } from "../middleware/auth.middleware";
import {
  documentCreate,
  documentUpdate,
  loanTypeCreate,
  loanTypeUpdate,
  typeCreate,
  typeUpdate,
} from "../api/document/document.controller.js";

const DocumentRoutes = express.Router();

DocumentRoutes.route("/document-type/create").post(tokenValidation, typeCreate);
DocumentRoutes.route("/document-type/update").post(tokenValidation, typeUpdate);
DocumentRoutes.route("/create").post(tokenValidation, documentCreate);
DocumentRoutes.route("/update").post(tokenValidation, documentUpdate);
DocumentRoutes.route("/loan-type/create").post(tokenValidation, loanTypeCreate);
DocumentRoutes.route("/loan-type/update").post(tokenValidation, loanTypeUpdate);

export default DocumentRoutes;
