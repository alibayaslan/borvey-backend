import mongoose from "mongoose";

export const ServiceUserSchema = mongoose.Schema({
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
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
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
  firm: {
    name: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
  },

  firmImages: [
    {
      type: String,
      required: false,
    },
  ],

  works: [
    {
      type: {
        type: String,
        enum: ["home", "single", "office", "short"],
        default: "home",
      },
      city: {
        type: String,
        required: false,
      },
      district: {
        type: String,
        required: false,
      },
      street: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
    },
  ],

  status: {
    type: String,
    enum: ["online", "offline", "blocked", "waitEmail", "deleted"],
    default: "waitEmail",
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
