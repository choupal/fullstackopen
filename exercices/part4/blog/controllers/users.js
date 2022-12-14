const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Get all users
usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  res.json(users);
});

// Add a new user
usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ error: "username must be unique" });
  }

  if (username === undefined || username.length < 3) {
    return res
      .status(400)
      .json({ error: "username must be at least 3 characters long." });
  }

  if (password === undefined || password.length < 3) {
    return res
      .status(400)
      .json({ error: "password must be at least 3 characters long." });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
