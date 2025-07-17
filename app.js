const express = require("express");
const qs = require("qs");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/globalErrorController");

const morgan = require("morgan");

const app = express();

app.use(express.json()); //use for body parser default return undefined

app.set("query parser", "extended");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`));

//define routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// handle all unreachable route
// express 4 "*" to replace "/*splat"
app.all("/*splat", async (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;
