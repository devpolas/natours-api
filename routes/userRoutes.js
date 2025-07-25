const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

// open for all users
router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router.route("/forgetPassword").post(authControllers.forgetPassword);
router.route("/resetPassword/:token").patch(authControllers.resetPassword);

// allow only current user
router.use(authControllers.protect);

router.route("/updatePassword").patch(authControllers.updatePassword);
router.route("/updateMe").patch(userControllers.updateMe);
router.route("/deleteMe").delete(userControllers.deleteMe);
router.route("/me").get(userControllers.getMe, userControllers.getUser);

//allow only admin
// run the middleware function restrict to admin for under the route
router.use(authControllers.restrictTo("admin"));
router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route("/:id")
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
