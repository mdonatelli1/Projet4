const UserModel = require('../models/user.model');

const { validateUserLogin, validateUserRegister } = require("../validators/userValidator");
const { hashPassword, verifyPassword } = require("../helpers/argonHelper");
const { encodeJWT } = require("../helpers/jwtHelper");

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // userValidator
  const errors = validateUserLogin(req.body);

  if (errors) {
    return res.status(401).send(errors);
  }
  // -------------
  
  const user = await UserModel.findOne({email: email});

  if (!user) {
    return res.status(401).json({ loginError: "La connexion a échoué" });
  }

  // argonHelper
  const passwordVerification = await verifyPassword(user.password, password);

  if (!passwordVerification) {
    return res.status(401).json({ loginError: "La connexion a échoué" });
  }

  user.password = undefined;
  const token = encodeJWT({ user });
  res.cookie("auth_token", token, { httpOnly: true, secure: false });
  res.status(200).json({ token: token, pseudo: user.pseudo, message: "La connexion a réussi" })
};

module.exports.registerUser = async (req, res) => {
  const { password, password2 } = req.body;

  if (password !== password2) {
    return res.status(422).json({ passwordError: "Les mots de passe doivent être identiques" });
  }

  // userValidator
  const errors = validateUserRegister(req.body);

  if (errors) {
    return res.status(401).send(errors);
  }
  // -------------

  // argonHelper
  const hashedPassword = await hashPassword(password);

  const user = await UserModel.create({ ...req.body, password: hashedPassword })
  res.status(200).json(user);
};
