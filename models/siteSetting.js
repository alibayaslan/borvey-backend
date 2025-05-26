import mongoose from "mongoose";
import { SiteSettingSchema } from "../schemas/siteSetting.js";

export const SiteSetting = mongoose.model("siteSetting", SiteSettingSchema);
