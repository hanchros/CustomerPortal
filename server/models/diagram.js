// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Diagram Schema
//= ===============================
const DiagramSchema = new Schema(
  {
    org_id: {
      type: String,
    },
    content: {
      type: String,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    position_x: {
      type: Number,
      default: 0,
    },
    position_y: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Diagram", DiagramSchema);
