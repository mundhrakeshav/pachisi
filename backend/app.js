const express = require("express");
const config = require("./config");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
const port = 3000;

const ROUTES = {
  SPORTS: require("./api/Sports/index"),
  // DOCTOR: require("./src/routes/doctor/index"),
  // HOSPITAL: require("./src/routes/hospital/index"),
};

app.use("/api", ROUTES.SPORTS);

app.listen(port, () => {
  console.log(`Server running on port ${port} 🔥`);
});
