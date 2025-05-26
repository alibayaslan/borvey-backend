import jwt, { decode } from "jsonwebtoken";
import { ServiceUser } from "../models/serviceUser.js";
import { PersonalUser } from "../models/personalUser.js";
import { comparePassword } from "./hashPassword.js";

const privateJWTKey = process.env.JWT_SECRET;

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer", "").replace(" ", "")
    : null;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = await jwt.verify(token, privateJWTKey);

    let userInfo;
    if (decoded.type === "personal") {
      userInfo = await PersonalUser.findOne({ email: decoded.email });
    } else if (decoded.type === "service") {
      userInfo = await ServiceUser.findOne({ email: decoded.email });
    }

    // console.log('appUser', appUser);
    if (userInfo.status === "blocked") {
      return res.status(401).send("User Blocked");
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
