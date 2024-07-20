import { StatusCodes } from "http-status-codes";
import { adminSignUpSchema30 } from "./user.schema";
import user from "./user.model";
import { Status } from "./UserConfig";
import {
  generateEmployeeId,
  generatePassword,
  MailSend,
} from "../../utilis/utilis";
import bcrypt from "bcrypt";
import { welcome } from "../../template/wlecome";

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

export { adminSignUpSchemaFirst };
