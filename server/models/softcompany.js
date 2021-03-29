// Importing Node packages required for schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;
//= ===============================
// SoftCompany Schema
//= ===============================
const SoftCompanySchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      org_name: {
        type: String,
        required: true,
      },
      org_type: { type: String },
      contact: { type: String },
      phone: { type: String },
      address: { type: String },
      website: { type: String },
      description: { type: String },
      logo: { type: String },
      doc_url: { type: String },
      example_url: { type: String },
      landing_url: { type: String },
      api_url: { type: String },
      main_service: { type: String },
      services: [
        {
          title: { type: String },
          items: {
            type: [String],
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save of user to database, hash password if password is modified or new
SoftCompanySchema.pre("save", function (next) {
  const softcompany = this,
    SALT_FACTOR = 5;
  if (!softcompany.isModified("password")) return next();
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(softcompany.password, salt, null, (err, hash) => {
      if (err) return next(err);
      softcompany.password = hash;
      next();
    });
  });
});

// Method to compare password for login
SoftCompanySchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("SoftCompany", SoftCompanySchema);
