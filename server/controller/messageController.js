const messageModel = require("../models/messageModel");

exports.addMessage = async (req, res, next) => {
  try {
    const { message, from, to } = req.body;
    console.log(message);
    const data = await messageModel.create({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Message added successfully" });
    }
    return res.json({ msg: "Failed to add message to the database" });
  } catch (error) {
    next(error);
  }
};
exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messsages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    const projectMessages = messsages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
