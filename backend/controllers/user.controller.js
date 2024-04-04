const UserModel = require('../models/user.model');

module.exports.getUserById = async (req, res) => {
  const user = await UserModel.findById(req.auth.user._id);
  res.status(200).json(user);
};

module.exports.getUsers = async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json(users);
};

module.exports.editUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    req.status(400).json({ message: "Cet utilisateur n'existe pas" });
  }

  const updateUser = await UserModel.findByIdAndUpdate(
    user,
    req.body,
    { new: true }
  )

  res.status(200).json({ updateUser });
};

module.exports.deleteUser = async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    req.status(400).json({ message: "Cet utilisateur n'existe pas" });
  }

  await UserModel.findByIdAndDelete(req.params.id);
  res.status(200).json( "Utilisateur supprimé " + req.params.id);
}
