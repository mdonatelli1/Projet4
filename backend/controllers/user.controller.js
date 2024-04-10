const UserModel = require('../models/user.model');

module.exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.auth.user._id);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports.editUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "Cet utilisateur n'existe pas" });
    }
  
    const updateUser = await UserModel.findByIdAndUpdate(
      user,
      req.body,
      { new: true }
    )
  
    res.status(204).json({ updateUser });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "Cet utilisateur n'existe pas" });
    }
  
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json( "Utilisateur supprimé " + req.params.id);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
