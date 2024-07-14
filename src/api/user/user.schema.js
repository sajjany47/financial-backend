import * as Yup from "yup";

const userSchema = Yup.object().shape({
  employeeId: Yup.string().required("EmployeeId is required"),
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string()
    .matches("/^[^s@]+@[^s@]+.[^s@]+$/", "Please enter valid email")
    .required("Email is required"),
  dob: Yup.date().required("Date of birth is required"),
  mobile: Yup.string().required("Mobile number is required"),
});
