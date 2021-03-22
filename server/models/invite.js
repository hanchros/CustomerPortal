// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Invite Schema
//= ===============================
const InviteSchema = new Schema(
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
      lowercase: true,
    },
    organization: {
      type: String,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    profile: {
      sender_name: { type: String },
      sender_organization: { type: String },
      logo: { type: String },
      content: { type: String },
    },
    type: {
      type: Number,
      // 0: request, 1: invite, 2: ex-invite
    },
    resolved: {
      type: Number,
      default: 1,
      // 0: cancelled, 1: pending, 2: resolved
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invite", InviteSchema);
