const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authControllers = require("./../controllers/authControllers");

const Router = express.Router({ mergeParams: true });

Router.route("/")
  .get(reviewController.getAllReview)
  .post(
    authControllers.protect,
    authControllers.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

Router.route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = Router;
