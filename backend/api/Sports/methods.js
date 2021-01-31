const getCricketData = (req, res) => {
  console.log("CricketData");
  return res.json({ RAW: 3000 });
};

module.exports = { getCricketData };
