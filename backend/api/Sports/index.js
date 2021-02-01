const express = require("express");
const methods = require("./methods");
const router = express.Router();

router.get("/cricket", methods.getCricketData);
router.get("/soccer", methods.getFootballMatches);
router.get("/sports/soccermatch/:matchID", methods.getFootballMatchData);

module.exports = router;
