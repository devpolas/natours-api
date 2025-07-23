const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address!"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "guide", "lead-guide", "admin"],
      message: `"{VALUE}" not supported please request with user, guide, lead-guide and admin. default value is user.`,
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minLength: [8, "Password minimum 8 character!"],
    maxLength: [32, "Password maximum 32 character!"],
    select: false, // hidden password field when get all user
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide same password!"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "password are not same",
    },
    minLength: [8, "Password minimum 8 character!"],
    maxLength: [32, "Password maximum 32 character!"],
  },
  image: String,
  createAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // if no modified password simply return
  if (!this.isModified("password")) return next();

  // hashing the password
  const hashPassword = await bcrypt.hash(this.password, 12);

  //set the password
  this.password = hashPassword;
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) return next();

  this.createAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctCredential = async function (
  candidateCredential,
  databaseCredential
) {
  return await bcrypt.compare(candidateCredential, databaseCredential);
};

userSchema.methods.afterChangedPassword = function (JWTTimeStamp) {
  if (this.createAt) {
    const changeTimeStamp = parseInt(this.createAt.getTime() / 1000, 10);
    return JWTTimeStamp < changeTimeStamp;
  }
  // default return false. user not changed password
  return false;
};

userSchema.methods.generateRandomTokenForgerPassword = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
