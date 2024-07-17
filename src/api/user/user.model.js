import { Position, Status } from "./UserConfig";

const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: String,
    name: String,
    position: {
      type: String,
      trim: true,
      enum: [
        Position.ADMIN,
        Position.AM,
        Position.CD,
        Position.CDM,
        Position.CM,
        Position.CUSTOMER,
        Position.FM,
        Position.LD,
        Position.LM,
        Position.PM,
        Position.SM,
        Position.VD,
      ],
      mobile: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      dob: Date,
      address: { type: String },
      state: String,
      country: String,
      city: String,
      pincode: { type: String, trim: true },
      password: { type: String, trim: true },
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
      status: {
        type: String,
        trim: true,
        lowercase: true,
        enum: [
          Status.WAITING,
          Status.PENDING,
          Status.VERIFIED,
          Status.REJECTED,
        ],
      },
      profileRatio: String,
      approvedBy: String,
      isActive: Boolean,
      createdBy: String,
      updatedBy: String,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);

export default user;
