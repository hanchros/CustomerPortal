// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Project Org Schema
//= ===============================
const ProjectOrgSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    option: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProjectOrg", ProjectOrgSchema);
