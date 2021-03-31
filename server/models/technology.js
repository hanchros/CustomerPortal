// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
//  Technology Schema
//= ===============================
const TechnologySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    logo: {
      type: String,
    },
    service: {
      type: String,
    },
    doc_url: {
      type: String,
    },
    api_url: {
      type: String,
    },
    example_url: {
      type: String,
    },
    landing_url: {
      type: String,
    },
    organization: { type: Schema.Types.ObjectId, ref: "SoftCompany" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Technology", TechnologySchema);
