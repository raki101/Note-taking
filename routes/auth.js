const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "fjin@u$";
const fetchUser = require("../middleware/fetchUser");

router.post(
  "/create",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    const jwtData = jwt.sign(data, JWT_SECRET);
    success = true;
    console.log(jwtData);
    res.json({ success, authData: jwtData });
  }
);

router.post(
  "/login",
  [
    // body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "login with current credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "please try to login with current credentials",
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      console.log(jwtData);
      success = true;
      res.json({ success, authData: jwtData });
    } catch (error) {
      res.status(500).send("error occured");
    }
  }
);

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    getId = req.user.id;
    const user = await User.findById(getId).select("-password");
    res.send(user);
  } catch {
    res.status(500).send("error occured");
  }
});

module.exports = router;
