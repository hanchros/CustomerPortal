// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// InviteRequest Schema
//= ===============================
const InviteRequestSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    organization: {
      type: String,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InviteRequest", InviteRequestSchema);
