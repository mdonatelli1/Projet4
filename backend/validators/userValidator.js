const Joi = require("joi");

const validateUserLogin = (user) => {
  const result = Joi
    .object({
      email: Joi.string().email().presence("required"),
      password: Joi.string().presence("required"),
  })
    .required()
    .validate(user, { abortEarly: false })
    .error;

  if (result) {
    const errorMessage = result.details.map((error) => ({
      message: error.message,
    }));
    
    return {
      errorCount: result.details.length,
      errorMessage,
    };
  }

  return false;
}

const validateUserRegister = (user) => {
  const result = Joi
    .object({
      email: Joi.string().email().presence("required"),
      password: Joi.string().presence("required"),
      password2: Joi.string().presence("required"),
      pseudo: Joi.string().presence("required"),
  })
    .required()
    .validate(user, { abortEarly: false })
    .error;

  if (result) {
    const errorMessage = result.details.map((error) => ({
      message: error.message,
    }));

    return {
      errorCount: result.details.length,
      errorMessage,
    };
  }

  return false;
}

module.exports = {
  validateUserLogin,
  validateUserRegister
};
