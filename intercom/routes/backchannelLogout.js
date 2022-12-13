const express = require("express");
const router = express.Router();

const jose = require("jose");

const { issuerBaseURL } = require("../config");
const { JWKS, redisClient, logger } = require("../utils");

/**
 * @name /backchannel-logout
 * @desc
 * OpenID Connect Backchannel Logout implementation to delete the session from the store
 */
router.post("/", async (req, res) => {
  const { payload, protectedHeader } = await jose.jwtVerify(  // decode and validates claims set
    req.body.logout_token,
    JWKS,
    {
      issuer: issuerBaseURL,
      maxTokenAge: "10 seconds"  // TODO: to avoid replay attack too far after issued_at
    }
  );
  redisClient.get(payload.sid, async (err, session_id) => {
    await redisClient.del("sess:" + session_id);
    await redisClient.del(payload.sid);
    logger.info("Backchannel logout");
    res.send("Done");
  });
});

module.exports = router;