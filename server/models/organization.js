// Importing Node packages required for schema
const mongoose = require("mongoose");

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
    linkedin: { type: String },
    logo: { type: String },
    bio: { type: String },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    profile: {
      primary_color: { type: String },
      secondary_color: { type: String },
      background_color: { type: String, default: "#fff" },
      menufont_color: { type: String },
      font_color: { type: String },
      link_color: { type: String },
      shadow_color: { type: String },
      title_page: { type: String },
      title_page_description: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Organization", OrgSchema);
