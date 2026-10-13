import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("style.css", "utf8");

const required = [
  "Abderrahim Neji",
  "Explore Selected Projects",
  "ZUPdeCO",
  "classification-pytorch",
  "OliveGrove_IOT",
  "FinalProjectDevops",
  "Gestion-Absence-Flutter-App",
  "nejiabderrahim@gmail.com",
  "https://github.com/AbderrahimNeji",
  "https://www.linkedin.com/in/abderrahim-neji",
  "Open to internships",
  "prefers-reduced-motion",
  "favicon.svg",
];

const missing = required.filter((item) => !html.includes(item) && !css.includes(item));

const forbidden = [
  "mAP@",
  "Download CV",
  "live demo",
  "streak",
  "glassmorphism",
];

const presentForbidden = forbidden.filter((item) =>
  html.toLowerCase().includes(item.toLowerCase())
);

const palette = ["#F8FAFC", "#FFFFFF", "#142033", "#586579", "#202B3C", "#2563EB", "#0F9D91", "#EAF2FF", "#E2E8F0"];
const missingColors = palette.filter((color) => !css.includes(color));

if (html.includes("href=\"cv") || html.includes("Download CV")) {
  presentForbidden.push("CV download");
}

const errors = [];
if (missing.length) errors.push("Missing required copy/assets: " + missing.join(", "));
if (presentForbidden.length) errors.push("Forbidden claims/UI: " + presentForbidden.join(", "));
if (missingColors.length) errors.push("Missing palette tokens: " + missingColors.join(", "));
if (!html.includes('id="projects"') || !html.includes('id="skills"') || !html.includes('id="contact"')) {
  errors.push("Missing core section ids");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("check.mjs: portfolio contract passed");
