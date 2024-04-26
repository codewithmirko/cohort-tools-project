const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/jwt.middleware");
require('dotenv').config();

// Signup Route

router.post("/signup", async (req, res, next) => {
  const { email, userName, password } = req.body;

  if (email === "" || password === "" || userName === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Encrypt the password
  const salt = bcrypt.genSaltSync(13);
  const passwordHash = bcrypt.hashSync(req.body.password, salt);
  // Create a new User
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const createdUser = await User.create({
      userName: userName,
      passwordHash: passwordHash,
      email: email,
    });

    const resUser = {
      email: createdUser.email,
      userName: createdUser.userName,
      _id: createdUser._id,
    };

    res.status(201).json(resUser);
  } catch (error) {
    console.log(error);
    next(error);
    // res.status(500).json(error);
  }
});

// Login-Route

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      const passwordCorrect = bcrypt.compareSync(
        password,
        foundUser.passwordHash
      );
      if (!passwordCorrect) {
        res.status(401).json({ message: "Incorrect password" });
        return;
      }

      const payload = {
        email: foundUser.email,
        userName: foundUser.userName,
        _id: foundUser._id,
      };

      console.log(process.env.SECRET);

      const authToken = jwt.sign(payload, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(201).json({
        message: "Token created, login is succesful",
        token: authToken,
      });
    } else {
      res.status(401).json({ message: "User doesn't exists." });
    }
  } catch (error) {
    next(error);
  }
});

// Verify-Route

router.get("/verify", isAuthenticated, (req, res, next) => {
  const payload = req.tokenPayload;

  console.log("Payload for verify", payload);

  res.status(200).json(payload);
});

module.exports = router;
