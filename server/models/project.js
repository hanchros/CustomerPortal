// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Project Schema
//= ===============================
const ProjectSchema = new Schema(
  {
    participant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    short_description: {
      type: String,
      required: true,
    },
    contact_detail: {
      type: String,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "FieldData" }],
    sharers: { type: [String] },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
