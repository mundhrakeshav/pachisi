const axios = require("axios").default;

const axiosAPIInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

module.exports = { axiosAPIInstance };
