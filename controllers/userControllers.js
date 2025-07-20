const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    image: req.body.image,
    createAt: req.body.createAt,
  });
  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "server error",
    message: "Fail to read data from server",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "server error",
    message: "Fail to read data from server",
  });
};

// filter other property without name and email
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes[el]) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route not for update password. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) filter req.body
  const filterBody = filterObj(req.body, "name", "email");
  // 2.1 update user document
  const user = await User.findByIdAndUpdate({ _id: req.user.id }, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User update successfully",
  });
});
