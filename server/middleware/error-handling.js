function errorHandler(err, req, res, next) {
  console.error("ERROR", req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).send("Internal Server Error");
  }
}

function notFoundHandler(req, res, next) {
  res.status(404).send("This route does not exist");
}

module.exports = { notFoundHandler, errorHandler };
