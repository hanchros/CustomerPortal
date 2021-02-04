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
    objective: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "In Progress",
    },
    technologies: [{ type: Schema.Types.ObjectId, ref: " Article" }],
    template: {
      type: Schema.Types.ObjectId,
      ref: "Template",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
