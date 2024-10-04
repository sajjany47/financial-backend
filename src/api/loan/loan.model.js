import mongoose from "mongoose";
import {
  EmployeeTypes,
  LoanApplicationSteps,
  ResidenceTypes,
} from "./loan.config.js";

const loanModel = new mongoose.Schema(
  {
    applicationNumber: String,
    loanAmount: Number,
    loanType: mongoose.Schema.Types.ObjectId,
    loanTenure: Number,
    name: String,
    mobile: String,
    email: String,
    dob: Date,
    fatherName: String,
    motherName: String,
    branch: mongoose.Schema.Types.ObjectId,

    permanentHouseOrBuildingNumber: String,
    permanentStreet: String,
    permanentLandmark: String,
    permanentPincode: String,
    permanentState: Number,
    permanentCountry: Number,
    permanentCity: Number,
    residenceHouseOrBuildingNumber: String,
    residenceStreet: String,
    residenceLandmark: String,
    residencePincode: String,
    residenceState: Number,
    residenceCountry: Number,
    residenceCity: Number,
    residenceType: {
      type: String,
      enum: ResidenceTypes,
    },
    addressSame: Boolean,

    companyOrBussinessName: String,
    jobTitle: String,
    employmentType: { type: String, trim: true, enum: EmployeeTypes },
    yearsOfExperience: Number,
    monthlyIncome: Number,
    shopOrBuildingNumber: String,
    workStreet: String,
    workLandmark: String,
    workPincode: String,
    workState: Number,
    workCountry: Number,
    workCity: Number,

    document: Array,
    // IDProof: Object,
    // addressProof: Object,
    // incomeProof: Object,
    // bankStatement: Object,
    // employmentProof: Object,

    accountNumber: String,
    bankName: String,
    bankBranchName: String,
    ifsc: String,
    accountName: String,

    interestRate: Number,
    status: {
      type: String,
      enum: LoanApplicationSteps,
    },
    applicationStaus: {
      type: String,
      enum: [
        "lead",
        "incompleted",
        "progress",
        "approved",
        "disbursed",
        "rejected",
      ],
    },
    remark: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
    addressVerifiedBy: mongoose.Schema.Types.ObjectId,
    officeOrBussinessVerifiedBy: mongoose.Schema.Types.ObjectId,
    documentVerifiedBy: mongoose.Schema.Types.ObjectId,
    loanVerifiedBy: mongoose.Schema.Types.ObjectId,
    loanAllotAgent: mongoose.Schema.Types.ObjectId,
    activeIndex: Number,
  },
  {
    timestamps: true,
  }
);

const Loan = mongoose.model("loan", loanModel);

export default Loan;
