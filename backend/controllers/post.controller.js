const PostModel = require('../models/post.model');

module.exports.getPostById = async (req, res) => {
  const post = await PostModel.findById(req.params.id);
  res.status(200).json(post);
}

module.exports.getPosts = async (req, res) => {
  const posts = await PostModel.find();
  res.status(200).json(posts);
};

module.exports.setPost = async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({ message: "Merci d'ajouter un message" })
  }

  const post = await PostModel.create({
    message: req.body.message,
    authorId: req.body.authorId,
    authorPseudo: req.body.authorPseudo
  })
  res.status(200).json(post);
};

module.exports.editPost = async (req, res) => {
  const post = await PostModel.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Ce post n'existe pas" });
  }

  if (req.auth.user._id !== post.authorId) {
    return res.status(401).json({ message: "Vous n'êtes pas l'auteur de ce post" });
  }

  const updatePost = await PostModel.findByIdAndUpdate(
    post,
    req.body,
    { new: true }
  )

  res.status(200).json({ updatePost });
};

module.exports.deletePost = async (req, res) => {
  const post = await PostModel.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Ce post n'existe pas" });
  }

  if (req.auth.user._id !== post.authorId) {
    return res.status(401).json({ message: "Vous n'êtes pas l'auteur de ce post" });
  }

  await PostModel.findByIdAndDelete(req.params.id);
  res.status(200).json( "Message supprimé " + req.params.id);
}

module.exports.likePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {$addToSet: { likers: req.body.userId } },
      { new: true }
    ).then((data) => res.status(200).send(data))
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports.dislikePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {$pull: { likers: req.body.userId } },
      { new: true }
    ).then((data) => res.status(200).send(data))
  } catch (err) {
    res.status(400).json(err);
  }
}
