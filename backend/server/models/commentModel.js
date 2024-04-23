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
    lineID: {
      type: String,
      required: true,
      label: "lineID",
    },
    stationID: {        // New field for station ID
      type: String,
      required: false,  // This field is not required
      label: "stationID",
    },
    time: {
      required: true,
      type: Date,
      default: Date.now,
    },
  },
  { collection: "comments" }
);

module.exports = mongoose.model('comments', commentSchema);
