const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router.route("/forgetPassword").post(authControllers.forgetPassword);
router.route("/resetPassword/:token").patch(authControllers.resetPassword);
router
  .route("/updatePassword")
  .patch(authControllers.protect, authControllers.updatePassword);

router
  .route("/updateMe")
  .patch(authControllers.protect, userControllers.updateMe);

router
  .route("/deleteMe")
  .delete(authControllers.protect, userControllers.deleteMe);

router
  .route("/me")
  .get(authControllers.protect, userControllers.getMe, userControllers.getUser);

router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    userControllers.createUser
  );

router
  .route("/:id")
  .get(userControllers.getUser)
  .patch(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    userControllers.updateUser
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    userControllers.deleteUser
  );

module.exports = router;
