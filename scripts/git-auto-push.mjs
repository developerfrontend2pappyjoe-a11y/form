import { execSync } from "child_process";
import { watch } from "fs";
import { join } from "path";

const DEBOUNCE_MS = 5000;
const BRANCH = "main";
const IGNORED_SEGMENTS = [
  ".git",
  "node_modules",
  "dist",
  "dist-ssr",
  ".cursor",
];

let debounceTimer = null;
let isPushing = false;

const hasIgnoredSegment = (filePath) =>
  IGNORED_SEGMENTS.some((segment) => filePath.includes(segment));

const runGit = (command) => {
  execSync(command, { stdio: "inherit", cwd: process.cwd() });
};

const hasChanges = () => {
  try {
    runGit("git diff --quiet");
    runGit("git diff --cached --quiet");
    return false;
  } catch {
    return true;
  }
};

export const autoPush = async () => {
  if (isPushing) {
    return;
  }

  if (!hasChanges()) {
    console.log("No changes to push.");
    return;
  }

  isPushing = true;

  try {
    const timestamp = new Date().toLocaleString();
    runGit("git add -A");
    runGit(`git commit -m "Auto-save: ${timestamp}"`);
    runGit(`git push origin ${BRANCH}`);
    console.log("Changes pushed to GitHub.");
  } catch (error) {
    console.error("Auto-push failed:", error.message);
  } finally {
    isPushing = false;
  }
};

const schedulePush = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    autoPush();
  }, DEBOUNCE_MS);
};

const startWatcher = () => {
  console.log("Watching for file changes. Auto-push runs 5s after edits stop.");

  watch(
    process.cwd(),
    { recursive: true },
    (_, filename) => {
      if (!filename || hasIgnoredSegment(join(filename))) {
        return;
      }

      console.log(`Change detected: ${filename}`);
      schedulePush();
    }
  );
};

const isWatchMode = process.argv.includes("--watch");

if (isWatchMode) {
  startWatcher();
} else {
  await autoPush();
}
