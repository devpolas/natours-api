const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

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
