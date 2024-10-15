import mongoose from "mongoose";

const chargesModel = new mongoose.Schema(
  {
    processingFees: String,
    processingFeesGST: String,
    loginFees: String,
    loginFeesGST: String,
    otherCharges: String,
    otherChargesGST: String,
    foreclosureFees: String,
    foreclosureFeesGST: String,
    foreclosureApply: String,
    overdue: String,
    isActive: Boolean,
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const charges = mongoose.model("charges", chargesModel);

export default charges;
