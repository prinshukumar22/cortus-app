//! 3rd party imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socket = require("socket.io");

//! Imports from files
const userRoute = require("./routes/userRoute");
const msgRoute = require("./routes/messageRoute");

//! Necessary configs
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "chats",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", userRoute);
app.use("/api/messages", msgRoute);

//! created a server to listen
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: process.env.BASE_URI,
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
});
