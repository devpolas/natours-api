const mongoose = require("mongoose");
const User = require("./userModel");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"],
      },
    ],
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour"],
      },
    ],
    message: {
      type: String,
      required: [true, "Review con't be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: "tour", select: "name" }).populate({
  //   path: "user",
  //   select: "name photo",
  // });

  // only populate with users but we declare virtual review property in toursModal
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
