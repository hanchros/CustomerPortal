// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Security Question Schema
//= ===============================
const SecurityQuestionSchema = new Schema(
  {
    participant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        question: { type: Schema.Types.ObjectId, ref: "User" },
        answer: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SecurityQuestion", SecurityQuestionSchema);
