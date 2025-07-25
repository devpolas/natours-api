const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authControllers = require("./../controllers/authControllers");

const router = express.Router({ mergeParams: true });

// run the middleware for users
router.use(authControllers.protect);

router
  .route("/")
  .get(reviewController.getAllReview)
  .post(
    authControllers.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(
    authControllers.restrictTo("user", "admin"),
    reviewController.deleteReview
  )
  .patch(
    authControllers.restrictTo("user", "admin"),
    reviewController.updateReview
  );

module.exports = router;
