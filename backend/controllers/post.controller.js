const PostModel = require("../models/post.model");
const { validatePost } = require("../validators/postValidator")

module.exports.getPostById = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports.getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports.setPost = async (req, res) => {
  try {
    if (!req.body.message) {
      res.status(400).json({ message: "Merci d'ajouter un message" })
    }
  
    // postValidator
    const errors = validatePost(req.body);

    if (errors) {
      console.log(errors)
      return res.status(401).send(errors);
    }
    // -------------

    const post = await PostModel.create({
      message: req.body.message,
      authorId: req.body.authorId,
      authorPseudo: req.body.authorPseudo
    })
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports.editPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Ce post n'existe pas" });
    }
  
    if (req.auth.user._id !== post.authorId) {
      return res.status(403).json({ message: "Vous n'êtes pas l'auteur de ce post" });
    }
  
    // postValidator
    const errors = validatePost(req.body);

    if (errors) {
      return res.status(401).send(errors);
    }
    // -------------

    const updatePost = await PostModel.findByIdAndUpdate(
      post,
      req.body,
      { new: true }
    )
  
    res.status(204).json({ updatePost });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Ce post n'existe pas" });
    }
  
    if (req.auth.user._id !== post.authorId) {
      return res.status(403).json({ message: "Vous n'êtes pas l'auteur de ce post" });
    }
  
    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json( "Message supprimé " + req.params.id);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports.likePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {$addToSet: { likers: req.body.userId } },
      { new: true }
    )

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports.dislikePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {$pull: { likers: req.body.userId } },
      { new: true }
    )

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json(err);
  }
}
