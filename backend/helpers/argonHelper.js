const argon2 = require("argon2");

const hashingOption = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOption);
};

const verifyPassword = (hashedPassword, plainPassword) => {
  return argon2.verify(hashedPassword, plainPassword);
}

module.exports = {
  hashPassword,
  verifyPassword
};
