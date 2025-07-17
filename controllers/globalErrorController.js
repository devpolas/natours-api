const AppError = require("./../utils/appError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handelDuplicateError = (err) => {
  const message = `${
    err.keyValue.name || err.keyValue.email
  } already have! Please try another!`;
  return new AppError(message, 400);
};

const handelValidationError = (err) => {
  const errorList = Object.values(err.errors).map((el) => el.message);
  const message = errorList.join(". ");
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProductionError = (err, res) => {
  // Don't send accidentally other error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // when it was not operational error send the default error
    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
};
const handleJWTerror = () => {
  return new AppError("Please login first!", 401);
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, name: err.name };

    if (error.name === "CastError") error = handleCastError(error);
    if (error.name === "ValidationError") error = handelValidationError(error);
    if (error.code === 11000) error = handelDuplicateError(error);
    if (error.name === "TokenExpiredError" || "JsonWebTokenError")
      error = handleJWTerror();
    // sent the other operational error
    sendProductionError(error, res);
  }
};
