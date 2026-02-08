const base = require("./index");

/** @type {import("prettier").Config} */
module.exports = {
  ...base,
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/",
    "",
    "^[./]",
  ],
};
