// Importing Node packages required for schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

//= ===============================
// Organization Schema
//= ===============================
const OrgSchema = new Schema(
  {
    org_name: {
      type: String,
      unique: true,
      required: true,
    },
    org_type: { type: String },
    location: { type: String },
    social: { type: String },
    logo: { type: String },
    bio: { type: String },
    color: { type: String, default: "#000" },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Organization", OrgSchema);
