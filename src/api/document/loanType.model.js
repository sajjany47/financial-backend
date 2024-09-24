import mongoose from "mongoose";

const loanTypeModel = new mongoose.Schema(
  {
    name: String,
    entity: String,
    country: [mongoose.Schema.Types.ObjectId],
    icon: String,
    isActive: Boolean,
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);

const loanType = mongoose.model("loanType", loanTypeModel);

export default loanType;
