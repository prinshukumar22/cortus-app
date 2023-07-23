const mongoose = require("mongoose");
const { model, models } = mongoose;
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
    unique: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: [true, "Username is Required"],
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = models.Users || model("Users", userSchema);
