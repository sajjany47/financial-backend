import mongoose from "mongoose";

const loanTypeModel = new mongoose.Schema(
  {
    name: String,
    entity: String,
    country: [Number],
    icon: String,
    path: String,
    isActive: Boolean,
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);

const loanType = mongoose.model("loanType", loanTypeModel);

export default loanType;
