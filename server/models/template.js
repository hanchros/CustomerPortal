// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Template Schema
//= ===============================
const TemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    objective: {
      type: String,
    },
    technologies: [
      {
        application: { type: String, required: true },
        organization: { type: String, required: true },
        description: { type: String },
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Template", TemplateSchema);
