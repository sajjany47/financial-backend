import { Position, Status, fresherOrExperience } from "./UserConfig.js";

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: String,
    name: String,
    username: String,
    position: {
      type: String,
      trim: true,
      enum: [
        Position.ADMIN,
        Position.BM,
        Position.SM,
        Position.LM,
        Position.PM,
        Position.AM,
        Position.CDM,
        Position.CD,
        Position.LD,
        Position.VD,
        Position.FM,
        Position.CUSTOMER,
      ],
    },
    jobBranchName: String,
    mobile: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dob: Date,
    address: { type: String },
    state: String,
    country: String,
    city: String,
    pincode: { type: String, trim: true },
    password: String,
    isPasswordReset: Boolean,
    education: [
      {
        boardName: { type: String },
        passingYear: { type: String, trim: true },
        marksPercentage: { type: String, trim: true },
      },
    ],
    fresherOrExperience: {
      type: String,
      enum: [fresherOrExperience.EXPERIENCE, fresherOrExperience.FRESHER],
    },
    workDetail: [
      {
        companyName: { type: String },
        position: { type: String },
        startingYear: { type: String, trim: true },
        endingYear: { type: String, trim: true },
      },
    ],
    aadharNumber: { type: String, trim: true },
    voterNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    passportNumber: { type: String, trim: true },
    bankName: { type: String, lowercase: true },
    accountNumber: { type: String, trim: true },
    ifsc: { type: String, trim: true },
    branchName: { type: String, lowercase: true },
    isProfileVerified: {
      type: String,
      trim: true,
      lowercase: true,
      enum: [Status.PENDING, Status.VERIFIED, Status.REJECTED],
    },
    profileRatio: String,
    approvedBy: String,
    isActive: Boolean,
    createdBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);

export default user;
