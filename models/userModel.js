const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please tell us your name!"]
  },
  email: {
    type: String,
    require: [true, "Please Provide Your Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  photo: String,
  password: {
    type: String,
    require: true,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    require: [true, "Please confirm your password"],
    validate: {
      validator: function(el) {
        // Only works On SAVE and CREATE
        return el === this.password;
      },
      message: "Password are not same! Please use same Password."
    }
  }
});

userSchema.pre("save", async function(next) {
  // The function rum when password modified
  if (!this.isModified("password")) return next();

  // Password make secure with bcrypt
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
