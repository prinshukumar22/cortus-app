const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.post("/register", userController.postRegister);

router.post("/login", userController.postLogin);

router.post("/setAvatar/:userId", userController.postSetAvatar);

router.get("/allUsers/:id", userController.getAllUsers);

module.exports = router;
