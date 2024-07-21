import { StatusCodes } from "http-status-codes";
import { adminSignUpSchema30 } from "./user.schema.js";
import user from "./user.model.js";
import { Status } from "./UserConfig.js";
import {
  generateEmployeeId,
  generatePassword,
  MailSend,
} from "../../utilis/utilis.js";
import bcrypt from "bcrypt";
import { welcome } from "../../template/wlecome.js";

export const adminSignUpSchemaFirst = async (req, res) => {
  try {
    const validatedUser = await adminSignUpSchema30.validate(req.body);
    if (validatedUser) {
      const isValid = await user.findOne({ username: validatedUser.username });

      if (!isValid) {
        const password = await generatePassword();
        const employeeId = await generateEmployeeId();

        const userData = new user({
          ...validatedUser,
          password: await bcrypt.hash(password, 10),
          employeeId: employeeId,
          isProfileVerified: Status.PENDING,
          profileRatio: "30%",
          approvedBy: req.id,
          isActive: true,
          createdBy: req.id,
        });

        const saveUser = await userData.save();
        if (saveUser) {
          MailSend({
            to: [validatedUser.email],
            subject: "Registration Successfully",
            html: welcome({
              sender: req.name,
              username: validatedUser.username,
              password: password,
            }),
          });
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
