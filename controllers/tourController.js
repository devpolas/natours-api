const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // build query
    //1) filtering query
    // const queryOgj = { ...req.query };
    // const excluededFields = ["page", "sort", "limit", "fields"];
    // excluededFields.forEach((el) => delete queryOgj[el]);

    // // 2) filtering advance query

    // let queryString = JSON.stringify(queryOgj);
    // queryString = queryString.replace(
    //   /\b(gte|ge|lte|lt)\b/g,
    //   (matches) => `$${matches}`
    // );

    // let query = Tour.find(JSON.parse(queryString));

    // // sorting query
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createAt");
    // }

    // // fields query
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // // pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip > numTours) {
    //     res.status(404).json({
    //       status: "Fail",
    //       message: "Page doesn't exits",
    //     });
    //   }
    // }

    // set query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .selectFields()
      .paginate();

    const tours = await features.query;

    // response with query
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newTour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: "true",
      new: "true"
    });
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          num: { $sum: 1 },
          munRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" }
        }
      }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};
