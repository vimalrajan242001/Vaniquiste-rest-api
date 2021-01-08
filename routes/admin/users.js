const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");

//route     POST api/user
//desc      user register route
//access    public
router.post(
  "/",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Valid Email is Required").isEmail(),
    check("password", "Password must be minimum 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      let role = "admin";

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        role
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT,
        { expiresIn: "10 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token,user });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("serer error");
    }
  }
);

module.exports = router;
