exports.triggerError = (req, res, next) => {
  const error = new Error("Intentional Server Error Triggered");
  error.status = 500;
  throw error; // This will be caught by the error handler middleware
};
