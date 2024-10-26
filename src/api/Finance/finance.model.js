import mongoose from "mongoose";

const financeModel = new mongoose.Schema(
  {
    name: String,
    mobile: String,
    email: String,
    dob: Date,
    investmentType: String,
    investmentAmount: Number,
    duration: Number,
    interestRate: Number,
    payoutFrequency: String,
    payoutDate: Date,
    accountNumber: String,
    bankName: String,
    bankBranchName: String,
    ifsc: String,
    accountName: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const finance = mongoose.model("finance", financeModel);

export default finance;
