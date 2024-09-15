import * as Yup from "yup";
import { LoanTypes } from "./loan.config.js";

export const LeadSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    // .matches("/S+@S+.S+/", "Please enter valid email")
    .required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  loanType: Yup.array()
    .oneOf(LoanTypes)
    .min(1, "Minimum one loan select")
    .required("Loan type is required"),
  loanTenure: Yup.string().required("Loan tenure is required"),
  loanAmount: Yup.string().required("Loan Amount is required"),
});
