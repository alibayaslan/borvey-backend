import mongoose from "mongoose";

export const AdminSchema = mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
});
