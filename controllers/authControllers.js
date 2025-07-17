const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendMail = require("./../utils/email");
const crypto = require("crypto");

const signJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    image: req.body.image,
    createAt: req.body.createAt,
  });

  const token = signJWTToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      message: "user created successfully!",
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check emil and password
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctCredential(password, user.password))) {
    return next(
      new AppError(
        "Incorrect email or password! Please provide correct one!",
        401
      )
    );
  }

  const token = signJWTToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) check jwt token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Please login!", 401));
  }
  //2) check valid jwt token

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check user exits
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new AppError("Create account first!", 401));
  }

  //4) change password after login

  if (currentUser.afterChangedPassword(decode.iat)) {
    return next(new AppError("Please login!", 401));
  }
  //5) Grand access the protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new AppError("You can't perform this act", 403));
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please enter your email address!", 404));
  }
  // 1) get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("You submit wrong credential! Please try again!", 404)
    );
  }
  //2) generate the random token
  const token = user.generateRandomTokenForgerPassword();
  await user.save({ validateBeforeSave: false });

  //3) send token user email
  const requestURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetPassword/${token}`;
  const message = `Forget Your Password! Click this link to reset password:\n${requestURL} \nif you didn't forget your password, Please ignore this email.`;

  try {
    await sendMail({
      email: user.email,
      subject: "Your requested url valid for 10 minutes!",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "We already send an email. Please check your email inbox",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(new AppError("Fail to send mail", 403));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) check token and encode the request token and find user base on token
  if (!req.params.token) {
    return next(
      new AppError("You submit wrong credential! Please try again!", 404)
    );
  }
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  // 2) check the like validation
  if (!user) {
    return next(
      new AppError(
        "Your link is invalid or has expired! Please try again!",
        400
      )
    );
  }
  // 2) update user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();

  // 3) send new json web token
  const token = signJWTToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      message: "user created successfully!",
    },
  });
});
