import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("style.css", "utf8");
const js = readFileSync("script.js", "utf8");

const required = [
  "Abderrahim Neji",
  "Explore projects",
  "Software &amp; Data Engineering student focused on",
  "ZUPdeCO",
  "classification-pytorch",
  "OliveGrove_IOT",
  "FinalProjectDevops",
  "Gestion-Absence-Flutter-App",
  "nejiabderrahim@gmail.com",
  "https://github.com/AbderrahimNeji",
  "https://www.linkedin.com/in/abderrahim-neji",
  "Open to internships",
  "Available for a PFE internship",
  "IT Strategix",
  "Tunisie Telecom",
  "University of Carthage",
  "neural-canvas",
  "prefers-reduced-motion",
  "favicon.svg",
  "Aymen Jeddou",
  "Mohamed Amine Trabelsi",
  "besmaguesmi",
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

const palette = [
  "#06080F",
  "#0A101C",
  "#0E1628",
  "#22D3EE",
  "#4C8DFF",
  "#8B7CFF",
  "#EEF3FB",
];
const missingColors = palette.filter((color) => !css.includes(color));

if (html.includes('href="cv') || html.includes("Download CV")) {
  presentForbidden.push("CV download");
}

const errors = [];
if (missing.length) errors.push("Missing required copy/assets: " + missing.join(", "));
if (presentForbidden.length) errors.push("Forbidden claims/UI: " + presentForbidden.join(", "));
if (missingColors.length) errors.push("Missing palette tokens: " + missingColors.join(", "));
if (!html.includes('id="projects"') || !html.includes('id="skills"') || !html.includes('id="contact"') || !html.includes('id="about"')) {
  errors.push("Missing core section ids");
}
if (!css.includes("pointer-events: none") && !css.includes("pointer-events:none")) {
  errors.push("Canvas/decor must use pointer-events: none");
}
if (!js.includes("IntersectionObserver")) {
  errors.push("script.js must use IntersectionObserver");
}
if (!html.includes("<dialog")) {
  errors.push("Missing native dialog case studies");
}
if (!js.includes("showModal")) {
  errors.push("script.js must open dialogs with showModal");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("check.mjs: portfolio contract passed");
