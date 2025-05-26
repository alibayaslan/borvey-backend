import mongoose from "mongoose";
import { ServiceUserSchema } from "../schemas/serviceUser.js";

export const ServiceUser = mongoose.model("serviceUser", ServiceUserSchema);
