const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

// Signup Route

router.post("/signup", async (req, res) => {
  // Get back the data from the body
  console.log(req.body);
  // Encrypt the password
  const salt = bcrypt.genSaltSync(13);
  const passwordHash = bcrypt.hashSync(req.body.password, salt);
  // Create a new User
  try {
    const newUser = await User.create({
      username: req.body.username,
      passwordHash: passwordHash,
      email: req.body.email,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Login-Route

// Verify-Route
