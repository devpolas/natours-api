const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authControllers = require("./../controllers/authControllers");

const Router = express.Router({ mergeParams: true });

Router.route("/")
  .get(reviewController.getAllReview)
  .post(
    authControllers.protect,
    authControllers.restrictTo("user"),
    reviewController.createReview
  );

Router.route("/:id").delete(reviewController.deleteReview);

module.exports = Router;
