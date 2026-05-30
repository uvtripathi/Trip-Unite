const util = require("util");

console.dev = (...args) => {
  if (process.env.production === "false") {
    console.log(util.format(...args));
  }
};












