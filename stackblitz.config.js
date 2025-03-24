// This file configures the project for StackBlitz environments
export default {
  // Install Bun if necessary in the StackBlitz environment
  installPreCommand: "npm install -g bun",

  // Use Bun for package management and running scripts
  managerCommand: "bun",

  // First command to run after setup
  initialCommand: "bun install && bun run dev",

  // Additional files to exclude in the StackBlitz environment
  excludeFiles: ["node_modules", "build"]
};
