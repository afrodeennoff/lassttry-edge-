#!/usr/bin/env node

import { spawnSync } from "node:child_process";

function run(command, args, label) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  if (label) {
    console.log(`[sync-stack] ${label}`);
  }
}

run("npx", ["prisma", "generate"], "Prisma client generated");

if (process.env.DATABASE_URL) {
  run("npx", ["prisma", "migrate", "deploy"], "Prisma migrations deployed");
} else {
  console.log("[sync-stack] DATABASE_URL is not set; skipped prisma migrate deploy");
}
