const User = require("../models/userModel");

//! it is used to encrypt your password
const bcrypt = require("bcrypt");

exports.postRegister = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, email, pwd } = req.body;
    const usernameCheck = await User.findOne({ username: username });
    // console.log(usernameCheck);
    if (usernameCheck)
      return res.json({ msg: "Username already existed", status: false });

    const emailCheck = await User.findOne({ email: email });
    if (emailCheck)
      return res.json({ msg: "Email already existed", status: false });

    const hashedPassword = await bcrypt.hash(pwd, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //! deleted it so that it couldn't be accessed using dev tools.(for security reasons)
    delete user.password;

    //! send the user data as a token
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { username, pwd } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        msg: "Incorrect username and password",
        status: false,
      });
    }
    const validPwd = await bcrypt.compare(pwd, user.password);
    if (!validPwd) {
      return res.json({
        msg: "Incorrect username and password",
        status: false,
      });
    }
    delete user.password;
    return res.json({ status: true, user });
  } catch (e) {
    next(e);
  }
};

exports.postSetAvatar = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage: avatarImage,
    });

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};
