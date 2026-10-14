import { existsSync, readFileSync, statSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("style.css", "utf8");
const js = readFileSync("script.js", "utf8");

const required = [
  "Abderrahim Neji",
  "Explore projects",
  "Software &amp; Data Engineering student focused on",
  "Software &amp; Data Engineering |",
  "AI/ML Engineer",
  "I build intelligent applications combining machine learning, computer vision, and LLM-powered systems",
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
  "assets/portrait-original.jpg",
  "Photograph of Abderrahim Neji",
  "hero-layout",
  "hero-portrait",
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

const otherPeople = [
  "Aymen Jeddou",
  "AymenJeddou",
  "Mohamed Amine Trabelsi",
  "TrabelsiAmin",
  "besmaguesmi",
  "Jeddou",
  "Trabelsi",
];
const namedPeople = otherPeople.filter((name) =>
  html.toLowerCase().includes(name.toLowerCase())
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
if (namedPeople.length) errors.push("Other people named in index.html: " + namedPeople.join(", "));
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
if (!css.includes("object-fit: cover") && !css.includes("object-fit:cover")) {
  errors.push("Portrait must use object-fit: cover");
}
if (!css.includes("object-position")) {
  errors.push("Portrait must set object-position");
}
if (!css.includes("prefers-reduced-motion")) {
  errors.push("CSS must honor prefers-reduced-motion");
}

const portrait = "assets/portrait-original.jpg";
const source = "assets/portrait-source.jpg";
if (!existsSync(portrait) || !existsSync(source) || !existsSync("assets/portrait-original.webp")) {
  errors.push("Missing portrait-original.jpg, portrait-original.webp, and/or portrait-source.jpg");
} else if (html.includes("assets/portrait.jpg") || html.includes("assets/portrait.webp") || html.includes("portrait-clean")) {
  errors.push("Hero still references portrait.jpg, portrait.webp, or portrait-clean");
} else {
  const edited = statSync(portrait).size;
  const original = statSync(source).size;
  if (edited < 8_000 || original < 8_000) {
    errors.push("Portrait files look empty or too small");
  }
}

if (html.includes('src="/assets/') || html.includes('href="/style.css"') || html.includes('src="/script.js"')) {
  errors.push("Asset paths must be relative for GitHub Pages at /abderrahim-neji-portfolio/");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("check.mjs: portfolio contract passed");
