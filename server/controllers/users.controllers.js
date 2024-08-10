const User = require("../models/users.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;


const register = async (req, res) => {
  const { email, password, password2, username } = req.body;

  if (!email || !password || !password2 || !username) {
    return res.json({ ok: false, message: "All fields required" });
  }
  if (password !== password2) {
    return res.json({ ok: false, message: "Passwords must match" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) return res.json({ ok: false, message: "Email exists!" });

    const name = await User.findOne({ username });
    if (name) return res.json({ ok: false, message: "Username taken!" });


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = {
      'email': email,
      'password': hash,
      'username': username,
      'recipes': []
    };

    await User.create(newUser);
    res.json({ ok: true, message: "Successfully registered" });
  } catch (error) {
    res.json({ ok: false, error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ ok: false, message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email provided" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, message: "Email or password is incorrect" });

    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const token = jwt.sign({ userEmail: user.email }, jwt_secret, {
        expiresIn: "7d",
      });
      res.json({ ok: true, message: `Welcome back ${user.username}!`, token, email });
    } else return res.json({ ok: false, message: "Email or password is incorrect" });
  } catch (error) {
    res.json({ ok: false, error });
  }
};

const verify_token = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, jwt_secret, (err, succ) => {
    err
      ? res.json({ ok: false, message: "Token is corrupted" })
      : res.json({ ok: true, succ });
  });
};


const editUser = async (req, res) => {
  const userEmail = req.user.userEmail;

  const { userPicture } = req.body;

  if (!userEmail) return res.json({ ok: false, message: "Error resolving user" });

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) return res.json({ ok: false, message: "Error finding user" });

    if (userPicture) {
      user.image = userPicture;
    }

    await user.save();
    res.json({ ok: true, message: "User updated successfully"})
  } catch (error) {
    res.json({ ok: false, message: error });
  }
};


const getUserPicture = async (req, res) => {
  const userEmail = req.user.userEmail;

  if (!userEmail) return res.json({ ok: false, message: "Error resolving user" });

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) return res.json({ ok: false, message: "Error finding user" });

    res.json({ ok: true, image: user.image });
  } catch (error) {
    res.json({ ok: false, message: error });
  }
}


module.exports = { register, login, verify_token, getUserPicture, editUser };