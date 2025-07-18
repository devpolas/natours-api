const express = require("express");
const tourControllers = require("../controllers/tourControllers");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.route("/getTourStates").get(tourControllers.getTourStates);

router.route("/monthly-plane/:year").get(tourControllers.getMonthlyPlane);

router
  .route("/")
  .get(authControllers.protect, tourControllers.getAllTours)
  .post(tourControllers.createNewTour);

router
  .route("/:id")
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin", "lead-guide"),
    tourControllers.deleteTour
  );

module.exports = router;
