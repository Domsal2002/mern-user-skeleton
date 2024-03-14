const mongoose = require("mongoose");

//comment schema/model
const profileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    bio: {
      type: String,
      required: true,
      label: "text",
    },
    email: {
      type: String,
      required: true,
      label: "email",
    },
    password: {
      required: true,
      type: String,
      min : 8
    },
    
    
  },
  { collection: "profiles" }
);

module.exports = mongoose.model('profile', profileSchema)