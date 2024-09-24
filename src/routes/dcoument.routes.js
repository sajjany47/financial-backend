import express from "express";

import {
  documentCreate,
  documentList,
  documentUpdate,
  loanTypeCreate,
  loanTypeList,
  loanTypeUpdate,
  typeCreate,
  typeList,
  typeUpdate,
} from "../api/document/document.controller.js";
import { tokenValidation } from "../middleware/auth.middleware.js";

const DocumentRoutes = express.Router();

DocumentRoutes.route("/document-type/create").post(tokenValidation, typeCreate);
DocumentRoutes.route("/document-type/update").post(tokenValidation, typeUpdate);
DocumentRoutes.route("/create").post(tokenValidation, documentCreate);
DocumentRoutes.route("/update").post(tokenValidation, documentUpdate);
DocumentRoutes.route("/loan-type/create").post(tokenValidation, loanTypeCreate);
DocumentRoutes.route("/loan-type/update").post(tokenValidation, loanTypeUpdate);

DocumentRoutes.route("/list").get(tokenValidation, documentList);
DocumentRoutes.route("/loan-type/list").get(tokenValidation, loanTypeList);
DocumentRoutes.route("/document-type/list").get(tokenValidation, typeList);

export default DocumentRoutes;
