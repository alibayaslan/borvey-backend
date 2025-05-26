import mongoose from "mongoose";
import { AdminSchema } from "../schemas/admin.js";

export const Admin = mongoose.model("admin", AdminSchema);
