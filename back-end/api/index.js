const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

const { app } = require("../app.js");
require("../utils/customConsole.js");

module.exports = async (req, res) => {
  return app(req, res);
};
