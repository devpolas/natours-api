const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const qs = require("qs");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/globalErrorController");

const morgan = require("morgan");

const app = express();

// Global middleware
app.use(helmet()); // secure http headers
app.use(cookieParser()); //enable cookie parser
app.set("query parser", "extended");

// set request limit with express-rate-limit
const limiter = rateLimit({
  limit: 100,
  windowMS: 60 * 60 * 100,
});

// apply the global reteLimit middleware
app.use(limiter);
//use for body parser req.body default return undefined and set limit max 10kb
app.use(express.json({ limit: "10kb" }));

// Data Sanitization against NoSQL query injection {"email":{$gt: ""}, "password":"correctAnyUserPassword"}
app.use(mongoSanitize());

// Data Sanitization against XSS (xcross site scripting attracts)
// make sure this comes before any routes
app.use(xss());

// prevent http parameter pollution
// some parameter keep on whiteList
app.use(
  hpp({
    whitelist: [
      "duration",
      "price",
      "difficulty",
      "maxGroupSize",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// requests are logging console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// serving static files
app.use(express.static(`${__dirname}/public`));

//define routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// handle all unreachable route
// express 4 "*" to replace "/*splat"
app.all("/*splat", async (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// control all errors
app.use(globalErrorController);

// export the app from file
module.exports = app;
