const express = require("express");
const methods = require("./methods");
const router = express.Router();

router.get("/sports", methods.getCricketData);

module.exports = router;
