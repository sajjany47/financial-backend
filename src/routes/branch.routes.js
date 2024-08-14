import express from "express";
import {
  branchList,
  createBranch,
  dataTable,
  updateBranch,
} from "../api/branch/branch.controller";

const BranchRoutes = express.Router();

BranchRoutes.route("/create").post(tokenValidation, createBranch);
BranchRoutes.route("/update").post(tokenValidation, updateBranch);
BranchRoutes.route("/list").get(tokenValidation, branchList);
BranchRoutes.route("/datatable").post(tokenValidation, dataTable);

export default BranchRoutes;
