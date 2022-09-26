const express = require("express");
const router = express.Router();

/**
 * @name /uuid
 * @desc returns the uuid of the logged in user
 */
router.get("/", (req, res) => {
  // TODO: wrong field, use username?
  let entryUUID = req.decodedIdToken["entryuuid"];
  res.send(entryUUID);
});

module.exports = router;