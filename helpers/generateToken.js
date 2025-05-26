import jwt from "jsonwebtoken";
import moment from "moment";

export const generateJwt = async (data, type) => {
  const token = jwt.sign(
    {
      name: data.name,
      email: data.email,
      password: data.password,
      type: type,
      date: moment().format(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "40d",
    }
  );
  return token;
};
