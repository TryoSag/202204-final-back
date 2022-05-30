const customError = (statusCode, customMessage, message = "") => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.customMessage = customMessage;
  error.message = message;

  return error;
};

module.exports = customError;
