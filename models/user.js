const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Plugin for passport-local-mongoose to handle authentication
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
