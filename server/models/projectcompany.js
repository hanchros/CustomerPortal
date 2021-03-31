// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// ProjectCompany Schema
//= ===============================
const ProjectCompanySchema = new Schema(
  {
    softcompany: {
      type: Schema.Types.ObjectId,
      ref: "SoftCompany",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    technology: {
      type: Schema.Types.ObjectId,
      ref: "Technology",
    },
    status: {
      type: Number,
      default: 1,
      // 0: resolved, 1: pending
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProjectCompany", ProjectCompanySchema);
