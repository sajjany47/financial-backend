import mongoose from "mongoose";
import { LoanTypes } from "../loan/loan.config.js";

const documentModel = new mongoose.Schema(
  {
    documentType: mongoose.Schema.Types.ObjectId,
    loanType: [mongoose.Schema.Types.ObjectId],
    documentName: String,
    country: [mongoose.Schema.Types.ObjectId],
    optional: Boolean,
    isActive: Boolean,
  },
  { timestamps: true }
);

const document = mongoose.model("document", documentModel);

export default document;