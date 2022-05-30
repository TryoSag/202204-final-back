const customError = (statusCode, customMessage, originalMessage = "") => {
  const error = new Error(originalMessage);
  error.statusCode = statusCode;
  error.customMessage = customMessage;
  error.message = originalMessage;

  return error;
};

module.exports = customError;
