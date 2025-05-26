import mongoose from "mongoose";
import { OfferSchema } from "../schemas/offer.js";

export const Offer = mongoose.model("offer", OfferSchema);
