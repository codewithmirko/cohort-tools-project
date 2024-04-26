const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("This is our index route");
});

module.exports = router;
