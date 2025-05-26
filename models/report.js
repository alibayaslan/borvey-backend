import mongoose from "mongoose";
import { ReportSchema } from "../schemas/report.js";

export const Report = mongoose.model("report", ReportSchema);
