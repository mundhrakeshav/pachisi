const axios = require("axios").default;

const axiosAPIInstance = axios.create({
  baseURL: "https://pachisi.herokuapp.com /api",
});

module.exports = { axiosAPIInstance };
