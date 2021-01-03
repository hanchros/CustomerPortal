// Importing Node packages required for schema
const mongoose = require("mongoose");
const ROLE_MEMBER = require("../constants").ROLE_MEMBER;
const ROLE_RESTRICT = require("../constants").ROLE_RESTRICT;
const ROLE_BLOCK = require("../constants").ROLE_BLOCK;
const ROLE_ADMIN = require("../constants").ROLE_ADMIN;
const ROLE_SUPER_ADMIN = require("../constants").ROLE_SUPER_ADMIN;
const Schema = mongoose.Schema;
const translateP = require("../helpers").translateP;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      org: { type: Schema.Types.ObjectId, ref: "Organization" },
      org_name: { type: String },
      integra_id: { type: String },
      photo: { type: String },
      address: { type: String },
      country: { type: String },
      phone: { type: String },
      personal_statement: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      facebook: { type: String },
      web: { type: String },
      tags: [{ type: Schema.Types.ObjectId, ref: "FieldData" }],
      contact: { type: String },
      role: { type: String },
    },
    role: {
      type: String,
      enum: [
        ROLE_MEMBER,
        ROLE_RESTRICT,
        ROLE_BLOCK,
        ROLE_ADMIN,
        ROLE_SUPER_ADMIN,
      ],
      default: ROLE_MEMBER,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verified: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = translateP(user.password);
  next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  let cp = translateP(candidatePassword);
  let isMatch = cp === this.password;
  cb(null, isMatch);
};

module.exports = mongoose.model("User", UserSchema);
