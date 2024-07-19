import * as Yup from "yup";
import { fresherOrExperience } from "./UserConfig";

export const customerSignUpSchema30 = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    .matches("/^[^s@]+@[^s@]+.[^s@]+$/", "Please enter valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string().required("Pincode is required"),
});

export const adminSignUpSchema30 = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    .matches("/^[^s@]+@[^s@]+.[^s@]+$/", "Please enter valid email")
    .required("Email is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years"),
  position: Yup.string()
    .oneOf([
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
    ])
    .required("Position is required"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string().required("Pincode is required"),
});

export const educationOrCompanyDetailSchema30 = Yup.object().shape({
  education: Yup.array(
    Yup.object({
      boardName: Yup.string().required("Board name is required"),
      passingYear: Yup.string()
        .required("Passing year is required")
        .matches("/^d{4}$/", "Enter valid year"),
      marksPercentage: Yup.string()
        .required("Passing year is required")
        .matches(
          "/^(100(.0{1,2})?|(d{1,2})(.d{1,2})?)$/",
          "Enter valid percentage"
        ),
    })
  )
    .required("Education details is required")
    .min(1, "Education details is required "),
  fresherOrExperience: Yup.string()
    .oneOf([fresherOrExperience.EXPERIENCE, fresherOrExperience.FRESHER])
    .required("Select one of this"),
  workDetail: Yup.array(
    Yup.object({
      companyName: Yup.string().required("Company name is required"),
      position: Yup.string().required("Position is required"),
      startingYear: Yup.string()
        .required("Starting year is required")
        .matches("/^d{4}$/", "Enter valid year"),
      endingYear: Yup.string()
        .required("Ending year is required")
        .matches("/^d{4}$/", "Enter valid year"),
    })
  ),
});
export const documentsSchema20 = Yup.object().shape({
  aadharNumber: Yup.string()
    .required("Aadhar number is required")
    .matches("/^d{12}$/", "Enter valid Aadhar number"),
  voterNumber: Yup.string()
    .required("Voter number is required")
    .matches("/^[A-Z]{3}d{7}$/", "Enter valid voter number"),
  panNumber: Yup.string()
    .required("Pan number is required")
    .matches("/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/", "Enter valid pan number"),
  passportNumber: Yup.string()
    .required("Passport number is required")
    .matches("/^[A-Z]{1}[0-9]{7}$/", "Enter valid Passport number"),
});
export const accountDetailSchema20 = Yup.object().shape({
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string()
    .required("Account number is required")
    .matches("/^d{9,18}$/", "Enter valid Account number"),
  branchName: Yup.string().required("Branch name is required"),
  status: Yup.string()
    .oneOf([Status.WAITING, Status.PENDING, Status.VERIFIED, Status.REJECTED])
    .required("Status is required"),
});

export const userSchema = Yup.object().shape({
  employeeId: Yup.string().required("EmployeeId is required"),
  name: Yup.string().required("Name is required"),
  position: Yup.string()
    .oneOf([
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
    ])
    .required("Position is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    .matches("/^[^s@]+@[^s@]+.[^s@]+$/", "Please enter valid email")
    .required("Email is required"),
  dob: Yup.date().required("Date of birth is required"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string().required("Pincode is required"),
  education: Yup.array(
    Yup.object({
      boardName: Yup.string().required("Board name is required"),
      passingYear: Yup.string()
        .required("Passing year is required")
        .matches("/^d{4}$/", "Enter valid year"),
      marksPercentage: Yup.string()
        .required("Passing year is required")
        .matches(
          "/^(100(.0{1,2})?|(d{1,2})(.d{1,2})?)$/",
          "Enter valid percentage"
        ),
    })
  )
    .required("Education details is required")
    .min(1, "Education details is required "),
  fresherOrExperience: Yup.string()
    .oneOf([fresherOrExperience.EXPERIENCE, fresherOrExperience.FRESHER])
    .required("Select one of this"),
  workDetail: Yup.array(
    Yup.object({
      companyName: Yup.string().required("Company name is required"),
      position: Yup.string().required("Position is required"),
      startingYear: Yup.string()
        .required("Starting year is required")
        .matches("/^d{4}$/", "Enter valid year"),
      endingYear: Yup.string()
        .required("Ending year is required")
        .matches("/^d{4}$/", "Enter valid year"),
    })
  )
    .required("Education details is required")
    .min(1, "Education details is required "),
  aadharNumber: Yup.string()
    .required("Aadhar number is required")
    .matches("/^d{12}$/", "Enter valid Aadhar number"),
  voterNumber: Yup.string()
    .required("Voter number is required")
    .matches("/^[A-Z]{3}d{7}$/", "Enter valid voter number"),
  panNumber: Yup.string()
    .required("Pan number is required")
    .matches("/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/", "Enter valid pan number"),
  passportNumber: Yup.string()
    .required("Passport number is required")
    .matches("/^[A-Z]{1}[0-9]{7}$/", "Enter valid Passport number"),
  ifsc: Yup.string()
    .required("IFSC code is required")
    .matches("/^[A-Z]{4}0[A-Z0-9]{6}$/", "Enter valid IFSC code"),
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string()
    .required("Account number is required")
    .matches("/^d{9,18}$/", "Enter valid Account number"),
  branchName: Yup.string().required("Branch name is required"),
  isActive: Yup.boolean().required("Active field is required"),
});
