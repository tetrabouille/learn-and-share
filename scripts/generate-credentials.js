const path = require("path");
const fs = require("fs");

const { google } = require("./env");

const googleTemplatePath = path.join(__dirname, "..", "google-credentials-template.json");
const googleCredentialsPath = path.join(__dirname, "..", "google-credentials.json");

let googleContent = fs.readFileSync(googleTemplatePath, "utf8");
Object.keys(google).forEach((key) => {
  const value = google[key]?.replace(/["']/g, "");
  if (!value) throw new Error(`Missing env : ${key}`);
  googleContent = googleContent.replace(new RegExp(`{{${key}}}`, "g"), value);
});
fs.writeFileSync(googleCredentialsPath, googleContent);
