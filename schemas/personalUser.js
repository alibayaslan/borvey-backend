import mongoose from "mongoose";

export const PersonalUserSchema = mongoose.Schema({
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
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offer" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
  status: {
    type: String,
    enum: ["online", "offline", "blocked", "waitEmail", "deleted"],
    default: "waitEmail",
  },
  resetPassword: {
    codeStatus: {
      type: String,
      enum: ["used", "waiting"],
      default: "used",
    },
    code: {
      type: String,
      required: false,
    },
    sendDate: {
      type: String,
      required: false,
    },
  },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "notification" },
  ],

  code: {
    code: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },

    isUsed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  deleteReason: {
    type: String,
    required: false,
  },

  registerDate: { type: Date, default: Date.now },
});
