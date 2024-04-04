const express = require("express");
const { getUserById, getUsers, editUser, deleteUser } = require("../controllers/user.controller");
const router = express.Router();

router.get("/me", getUserById);

router.get("/", getUsers);

router.put("/:id", editUser);

router.delete("/:id", deleteUser);

module.exports = router;
