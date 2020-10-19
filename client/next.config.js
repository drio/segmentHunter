/* eslint-disable */
const fs = require("fs");

const mode = process.env.NODE_ENV;

const fileName = "./config.json";

if (!fs.existsSync(fileName)) {
  console.log(`>> ${fileName} not found. Bailing out.`);
  process.exit(0);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(fileName, "utf-8"));
} catch {
  console.log("Errors loading json config file.");
  process.exit(0);
}

if (!config[mode]) {
  console.log(`>> No mode NODE_ENV=(${mode}) found in config. Bailing out.`);
  process.exit(0);
}

console.log(`>> config file loaded. Working in ${mode} mode.`);

module.exports = {
  env: { ...config[mode], ...{ version: config.version } },
};
