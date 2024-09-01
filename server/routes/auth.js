const express = require("express");
const { register, login, getUsers } = require("../controllers/authController");

const router = express.Router();

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post("/login", login);

// @route    POST api/auth/register
// @desc     Register a new user
// @access   Admin
router.post("/register", register);

// @route    GET api/auth/users
// @desc     Get all users
// @access   Admin
router.get("/users", getUsers);

module.exports = router;
