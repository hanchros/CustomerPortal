// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
//  Article Schema
//= ===============================
const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    video: {
      type: String,
    },
    image: {
      type: String,
    },
    tag: { type: Schema.Types.ObjectId, ref: "FieldData" },
    topic: {
      type: String,
    },
    files: {
      type: [String],
    },
    iframe: {
      type: String,
    },
    order: {
      type: Number,
      default: 1000,
    },
    show_iframe: {
      type: Boolean,
    },
    button_name: {
      type: String,
      default: "Go To Site",
    },
    icon: {
      type: String,
    },
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(" Article", ArticleSchema);
