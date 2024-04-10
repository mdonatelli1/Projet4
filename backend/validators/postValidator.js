const Joi = require("joi");

const validatePost = (post) => {
  const result = Joi
    .object({
      message: Joi.string().presence("required"),
      authorId: Joi.string().presence("optional"),
      authorPseudo: Joi.string().presence("optional"),
  })
    .required()
    .validate(post, { abortEarly: false })
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

module.exports = { validatePost };
