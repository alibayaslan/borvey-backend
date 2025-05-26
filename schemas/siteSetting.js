import mongoose from "mongoose";

export const SiteSettingSchema = mongoose.Schema({
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
  firms: [{ type: mongoose.Schema.Types.ObjectId, ref: "serviceUser" }],
  update: {
    type: String,
    required: false,
  },
  SEO: {
    homepage: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      tags: {
        type: String,
        required: false,
      },
    },
    about: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      tags: {
        type: String,
        required: false,
      },
    },
    faq: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      tags: {
        type: String,
        required: false,
      },
    },
    contact: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      tags: {
        type: String,
        required: false,
      },
    },
  },
});
