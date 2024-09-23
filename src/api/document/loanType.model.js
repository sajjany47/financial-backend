import mongoose from "mongoose";

const loanTypeModel = new mongoose.Schema(
  {
    name: String,
    country: [mongoose.Schema.Types.ObjectId],
    isActive: Boolean,
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);

const loanType = mongoose.model("loanType", loanTypeModel);

export default loanType;
