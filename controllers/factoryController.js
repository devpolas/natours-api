const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures.js");

exports.deleteOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("Not found!.", 404));
    }
    res.status(204).json({
      status: "success",
      message: "Deleted was succeeded!",
    });
  });

exports.updateOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("not found this id.", 404));
    }
    res.status(200).json({
      status: "success",
      message: "update document successfully!",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.create(req.body);
    res.status(201).json({
      status: "success",
      message: "create document successfully!",
      data: {
        doc,
      },
    });
  });

exports.getOne = (Modal, populateObject) =>
  catchAsync(async (req, res, next) => {
    let query = Modal.findById(req.params.id);
    if (populateObject) query = query.populate(populateObject);
    // with mongoose
    const doc = await query;

    if (!doc) {
      return next(new AppError("not found!", 404));
    }

    res.status(200).json({
      status: "success",
      message: "document loaded successfully!",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Modal) =>
  catchAsync(async (req, res, next) => {
    // review filtering with tour id
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const apiFeatures = new APIFeatures(Modal.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //* execute the query

    const doc = await apiFeatures.query;

    //? send response

    res.status(200).json({
      status: "success",
      message: "document are loaded successfully!",
      results: doc.length,
      data: {
        doc,
      },
    });
  });
