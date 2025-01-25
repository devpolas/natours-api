const AppError = require("./../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.keyValue.name;
  const message = `${value} name tour is already have, Try again another unique name`;
  return new AppError(message, 400);
};

const handelErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack
  });
};

const handelErrorPro = (err, res) => {
  // Operational, trusted error: sent message to clint
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    // 1) log error
    console.error("Error 💥", err);

    // 2) send generic message
    res.status(500).json({
      status: "fail",
      message: "Something went very wrong"
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    handelErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, name: err.name, code: err.code };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);

    handelErrorPro(error, res);
  }
};
