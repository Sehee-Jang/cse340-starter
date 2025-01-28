const handleErrors = (controllerFunction) => {
  return async (req, res, next) => {
    try {
      await controllerFunction(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).render("error", { message: "Internal Server Error" });
    }
  };
};

module.exports = { handleErrors };
