/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const pkg = require("../package.json");

module.exports = {
    dependencies: {
        [pkg.name]: {
            root: path.join(__dirname, ".."),
        },
    },
};
