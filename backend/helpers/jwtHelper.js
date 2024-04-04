const jwt = require("jsonwebtoken");

const encodeJWT = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1h" });
};

module.exports = { encodeJWT };
