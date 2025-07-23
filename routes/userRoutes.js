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
  .route("/")
  .get(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    userControllers.getAllUsers
  )
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    userControllers.createUser
  );

router
  .route("/:id")
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    userControllers.deleteUser
  );

module.exports = router;
