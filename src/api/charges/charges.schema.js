import * as Yup from "yup";

export const chargesSchema = Yup.object().shape({
  processingFees: Yup.string().required("Processing Fees is required"),
  processingFeesGST: Yup.string().required("Processing Fees GST is required"),
  loginFees: Yup.string().required("Login Fees is required"),
  loginFeesGST: Yup.string().required("Login Fees GST is required"),
  otherCharges: Yup.string().required("Other Charges is required"),
  otherChargesGST: Yup.string().required("Other Charges GST is required"),
});
