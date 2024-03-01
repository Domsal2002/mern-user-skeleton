const mongoose = require("mongoose");

//comment schema/model
const commentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    text: {
      type: String,
      required: true,
      label: "text",
    },
    time: {
      required: true,
      type: Date,
      default: Date.now,
    },
  },
  { collection: "comments" }
);

module.exports = mongoose.model('comments', commentSchema)