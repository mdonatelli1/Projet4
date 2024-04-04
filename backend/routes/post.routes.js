const express = require("express");
const { setPost, getPostById, getPosts, editPost, deletePost, likePost, dislikePost } = require("../controllers/post.controller");
const router = express.Router();

router.get("/:id", getPostById);

router.get("/", getPosts);

router.post("/", setPost);

router.put("/:id", editPost);

router.delete("/:id", deletePost);

router.patch("/like-post/:id", likePost);

router.patch("/dislike-post/:id", dislikePost);

module.exports = router;
