const Tour = require("./../models/tourModel.js");
const APIFeatures = require("./../utils/apiFeatures.js");
const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");
const factory = require("./factoryController.js");

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const apiFeatures = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   //* execute the query

//   const tours = await apiFeatures.query;

//   //? send response

//   res.status(200).json({
//     status: "success",
//     message: "tours are loaded successfully!",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // with mongoose
//   const tour = await Tour.findById(req.params.id).populate("reviews");

//   if (!tour) {
//     return next(new AppError("not found this id", 404));
//   }
//   // with real mongodb
//   //Tour.findOne({_id: req.params.id})

//   res.status(200).json({
//     status: "success",
//     message: "tour loaded successfully!",
//     data: {
//       tour,
//     },
//   });
// });

// exports.createNewTour = catchAsync(async (req, res, next) => {
//   // create tour with mongodb
//   // const newTour = new Tour({req.body})
//   // newTour.save()

//   // create tour with mongoose
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: "success",
//     message: "create new tour successfully!",
//     data: {
//       tour: newTour,
//     },
//   });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError("Tour not found this id.", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     message: "update tour successfully!",
//     data: {
//       tour,
//     },
//   });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError("Tour not found this id.", 404));
//   }
//   res.status(204).json({
//     status: "success",
//     message: "Deleted was succeeded!",
//   });
// });

// Get All document with factory function
exports.getAllTours = factory.getAll(Tour);
// Get document with factory function
exports.getTour = factory.getOne(Tour, { path: "reviews" });
// Create document with factory function
exports.createNewTour = factory.createOne(Tour);
// Update document with factory function
exports.updateTour = factory.updateOne(Tour);
// Delete document with factory function
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStates = catchAsync(async (req, res) => {
  const states = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        avgRatingQuantity: { $avg: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",

    data: {
      states,
    },
  });
});

exports.getMonthlyPlane = catchAsync(async (req, res) => {
  const year = req.params.year * 1;

  const plane = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        tour: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    { $sort: { numTours: -1 } },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plane,
    },
  });
});
