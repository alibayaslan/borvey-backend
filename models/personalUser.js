import mongoose from "mongoose";
import { PersonalUserSchema } from "../schemas/personalUser.js";

export const PersonalUser = mongoose.model("personalUser", PersonalUserSchema);
