import mongoose from "mongoose";

const branchModel = new mongoose.Schema(
  {
    name: String,
    country: String,
    state: String,
    city: String,
    email: String,
    phone: String,
    address: String,
    pincode: String,
    code: String,
    isActive: Boolean,
    createdBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

const branch = mongoose.model("branch", branchModel);

export default branch;
