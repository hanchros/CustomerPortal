// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
//  Article Schema
//= ===============================
const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    video: {
      type: String,
    },
    image: {
      type: String,
    },
    tag: { type: Schema.Types.ObjectId, ref: "FieldData" },
    topic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(" Article", ArticleSchema);
