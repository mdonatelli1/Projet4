const express = require("express");

const router = express.Router();

const authRoutes = require("./auth.routes");
const postRoutes = require("./post.routes");
const userRoutes = require("./user.routes");

const { authorization } = require("../middlewares/auth");

router.use("/auth", authRoutes);
router.use(authorization);
router.use("/posts", postRoutes);
router.use("/users", userRoutes);

module.exports = router;