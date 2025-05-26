import mongoose from "mongoose";

export const ContactSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  surname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  createdDate: {
    type: String,
    required: false,
  },
});
