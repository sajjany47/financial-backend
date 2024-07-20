import { StatusCodes } from "http-status-codes";
import { adminSignUpSchema30 } from "./user.schema";
import user from "./user.model";
import { Status } from "./UserConfig";
import { generateEmployeeId, generatePassword } from "../../utilis/utilis";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { welcome } from "../../template/wlecome";

const resend = new Resend("re_123456789");

const adminSignUpSchemaFirst = async (req, res) => {
  try {
    const validatedUser = await adminSignUpSchema30.validate(req.body);
    if (validatedUser) {
      const isValid = await user.findOne({ username: validatedUser.username });

      if (isValid) {
        const password = generatePassword();
        const userData = new user({
          ...validatedUser,
          password: await bcrypt.hash(password, 10),
          employeeId: generateEmployeeId(),
          isProfileVerified: Status.PENDING,
          profileRatio: "30%",
          approvedBy: req.id,
          isActive: true,
          createdBy: req.id,
        });

        const saveUser = await userData.save();
        if (saveUser) {
          const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [validatedUser.email],
            subject: "Registration Successfully",
            html: welcome({
              sender: req.name,
              username: validatedUser.username,
              password: password,
            }),
          });
          if (error) {
            return res.status(400).json({ error });
          }
        }
        return res
          .status(StatusCodes.OK)
          .json({ message: "User created successfully" });
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Username already exists" });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(error.message);
  }
};
