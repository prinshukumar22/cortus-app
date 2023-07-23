const express = require("express");

const messageController = require("../controller/messageController");

const router = express.Router();

router.post("/addMsg", messageController.addMessage);
router.post("/getMsg", messageController.getAllMessage);

module.exports = router;
