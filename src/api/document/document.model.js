import mongoose from "mongoose";
import { LoanTypes } from "../loan/loan.config.js";

const documentModel = new mongoose.Schema(
  {
    documentType: String,
    loanType: { type: Array, enum: LoanTypes },
    documentName: String,
    country: Array,
    optional: Boolean,
  },
  { timestamps: true }
);

const document = mongoose.model("document", documentModel);

export default document;
