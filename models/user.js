const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String
});

// Adds username, hash, salt fields for passport
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
