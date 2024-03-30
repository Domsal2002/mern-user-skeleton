const mongoose = require("mongoose");

//comment schema/model
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    time: {
      required: true,
      type: Date,
      default: Date.now,
    },
  },
  { collection: "admins" }
);

module.exports = mongoose.model('admin', adminSchema)