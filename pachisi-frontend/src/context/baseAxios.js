const axios = require("axios").default;

const axiosAPIInstance = axios.create({
  baseURL: "http://beede6f3ea27.ngrok.io/api",
});

module.exports = { axiosAPIInstance };
