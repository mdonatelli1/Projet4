const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const router = express.Router();

router.get("/login", loginUser);

router.post("/register", registerUser);

module.exports = router;
