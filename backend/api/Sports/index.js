const express = require("express");
const methods = require("./methods");
const router = express.Router();

router.get("/cricket", methods.getCricketData);
router.get("/soccer", methods.getFootballMatches);
router.get("/soccermatch/:matchID", methods.getFootballMatchData);
router.get("/cricketMatchResults/:matchID", methods.getCricketMatchWinner);
router.get("/cricketTossResults/:matchID", methods.getCricketTossWinner);

module.exports = router;
