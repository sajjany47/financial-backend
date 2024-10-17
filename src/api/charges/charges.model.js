import mongoose from "mongoose";

const chargesModel = new mongoose.Schema(
  {
    processingFees: Number,
    processingFeesGST: Number,
    loginFees: Number,
    loginFeesGST: Number,
    otherCharges: Number,
    otherChargesGST: Number,
    foreclosureFees: Number,
    foreclosureFeesGST: Number,
    foreclosureApply: Number,
    overdue: Number,
    isActive: Boolean,
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const charges = mongoose.model("charges", chargesModel);

export default charges;
