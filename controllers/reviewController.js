const Review = require("./../models/reviewModel.js");
const catchAsync = require("./../utils/catchAsync.js");
const factory = require("./factoryController.js");

// exports.getAllReview = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: "success",
//     data: {
//       reviews,
//     },
//   });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   const review = await Review.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       review,
//     },
//   });
// });

// export this function form here and use as review router post method middleware
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// delete review with factory controller //* simple pass the Review Document this function than take care this function
exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
