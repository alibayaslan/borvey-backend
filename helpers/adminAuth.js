import jwt, { decode } from "jsonwebtoken";
import { Admin } from "../models/admin.js";
import { comparePassword } from "./hashPassword.js";

const privateJWTKey = process.env.JWT_SECRET;

export const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer", "").replace(" ", "")
    : null;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = await jwt.verify(token, privateJWTKey);

    let userInfo;

    if (decoded) {
      userInfo = await Admin.findOne({ email: decoded.email });
    }

    if (
      userInfo &&
      decoded &&
      userInfo.email === decoded.email &&
      (await comparePassword(decoded.password, userInfo.password)) ===
        "correct password"
    ) {
      return next();
    } else {
      return res.status(401).send("Invalid Token");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
