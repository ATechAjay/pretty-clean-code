#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

/* ---------------- Import Local Config Files ---------------- */

const baseConfig = require("./index");
const nodeConfig = require("./node");
const nextConfig = require("./next");

/* ---------------- Parse Arguments ---------------- */

const args = process.argv.slice(2);
const preset = args[0] || "base";
const root = process.cwd();

const allowedPresets = ["base", "node", "next"];

if (!allowedPresets.includes(preset)) {
  console.log("❌ Invalid preset. Use: base | node | next");
  process.exit(1);
}

/* ---------------- Package Manager Detection ---------------- */

function detectPackageManager() {
  if (fs.existsSync(path.join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(root, "yarn.lock"))) return "yarn";
  return "npm";
}

const packageManager = detectPackageManager();

console.log(`📦 Installing Prettier and plugins using ${packageManager}...`);

try {
  const installCmd =
    packageManager === "yarn"
      ? "yarn add -D prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss"
      : packageManager === "pnpm"
        ? "pnpm add -D prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss"
        : "npm install -D prettier @ianvs/prettier-plugin-sort-imports prettier-plugin-tailwindcss";

  execSync(installCmd, { stdio: "inherit" });
} catch {
  console.error("❌ Failed to install dependencies.");
  process.exit(1);
}

/* ---------------- Select Config ---------------- */

function getConfig(preset) {
  if (preset === "next") return nextConfig;
  if (preset === "node") return nodeConfig;
  return baseConfig;
}

/* ---------------- Create prettier.config.js ---------------- */

const configPath = path.join(root, "prettier.config.js");

if (fs.existsSync(configPath)) {
  console.log("⚠ prettier.config.js already exists. Skipping creation.");
} else {
  console.log("📝 Creating prettier.config.js...");

  const selectedConfig = getConfig(preset);

  fs.writeFileSync(
    configPath,
    "module.exports = " + JSON.stringify(selectedConfig, null, 2) + ";\n",
  );
}

/* ---------------- Create .prettierignore ---------------- */

const ignorePath = path.join(root, ".prettierignore");

if (fs.existsSync(ignorePath)) {
  console.log("⚠ .prettierignore already exists. Skipping creation.");
} else {
  console.log("📝 Creating .prettierignore...");

  const ignoreContent =
    `
node_modules
dist
build
coverage
.next
out
`.trim() + "\n";

  fs.writeFileSync(ignorePath, ignoreContent);
}

/* ---------------- Inject Format Scripts ---------------- */

const pkgPath = path.join(root, "package.json");

if (fs.existsSync(pkgPath)) {
  const pkgRaw = fs.readFileSync(pkgPath, "utf8");
  const pkg = JSON.parse(pkgRaw);

  pkg.scripts = pkg.scripts || {};

  let modified = false;

  if (!pkg.scripts.format) {
    pkg.scripts.format = "prettier --write .";
    console.log("✨ Added 'format' script");
    modified = true;
  }

  if (!pkg.scripts["format:check"]) {
    pkg.scripts["format:check"] = "prettier --check .";
    console.log("✨ Added 'format:check' script");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
} else {
  console.log("⚠ No package.json found. Skipping script setup.");
}

console.log("✅ Setup complete!");
console.log(`👉 Using preset: ${preset}`);

/* ---------------- Ask to Format Immediately ---------------- */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "\n🚀 Do you want to format the entire project now? (y/n): ",
  (answer) => {
    if (answer.toLowerCase() === "y") {
      try {
        execSync("npx prettier --write .", { stdio: "inherit" });
        console.log("✅ Project formatted successfully!");
      } catch {
        console.log("❌ Formatting failed.");
      }
    } else {
      console.log("\n📌 You can format manually anytime:");
      console.log("👉 Format entire project:");
      console.log("   npm run format");
      console.log("\n👉 Check formatting:");
      console.log("   npm run format:check");
      console.log("\n👉 Format single file:");
      console.log("   npx prettier --write <file-path>");
    }

    rl.close();
  },
);
