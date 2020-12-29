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
    address: { type: String },
    country: { type: String },
    website: { type: String },
    logo: { type: String },
    authorized_name: { type: String },
    authorized_title: { type: String },
    authorized_email: { type: String, unique: true, required: true },
    authorized_password: { type: String, required: true },
    authorized_phone: { type: String },
    agree_terms: { type: String },
    contact_name: { type: String },
    contact_email: { type: String },
    contact_phone: { type: String },
    city: { type: String },
    state: { type: String },
    verified: { type: Boolean },
    tags: [{ type: Schema.Types.ObjectId, ref: "FieldData" }],
    attr: { type: Object },
  },
  {
    timestamps: true,
  }
);

//= ===============================
// Organization ORM Methods
//= ===============================

// Pre-save of org to database, hash password if password is modified or new
OrgSchema.pre("save", function (next) {
  const org = this,
    SALT_FACTOR = 5;

  if (!org.isModified("authorized_password")) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(org.authorized_password, salt, null, (err, hash) => {
      if (err) return next(err);
      org.authorized_password = hash;
      next();
    });
  });
});

// Method to compare password for login
OrgSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(
    candidatePassword,
    this.authorized_password,
    (err, isMatch) => {
      if (err) {
        return cb(err);
      }

      cb(null, isMatch);
    }
  );
};

module.exports = mongoose.model("Organization", OrgSchema);
