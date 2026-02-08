const base = require("./index");

/** @type {import("prettier").Config} */
module.exports = {
  ...base,
  importOrder: ["<THIRD_PARTY_MODULES>", "", "^[./]"],
};
