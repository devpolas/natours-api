const express = require("express");
const tourControllers = require("../controllers/tourControllers");
const authControllers = require("../controllers/authControllers");
const reviewRouter = require("./reviewRouter");

const router = express.Router();

router.route("/getTourStates").get(tourControllers.getTourStates);
router.route("/monthly-plane/:year").get(tourControllers.getMonthlyPlane);

// forward to this like router to review router with tour id
router.use("/:tourId/reviews", reviewRouter);

router
  .route("/")
  .get(tourControllers.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    tourControllers.createNewTour
  );

router
  .route("/:id")
  .get(tourControllers.getTour)
  .patch(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    tourControllers.updateTour
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    tourControllers.deleteTour
  );

module.exports = router;
