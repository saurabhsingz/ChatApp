const TryCatch = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export { ErrorHandler, TryCatch };
