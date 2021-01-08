// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Project Member Schema
//= ===============================
const ProjectMemberSchema = new Schema(
  {
    participant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProjectMember", ProjectMemberSchema);
