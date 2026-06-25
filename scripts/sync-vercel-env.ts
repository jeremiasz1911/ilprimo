import { config } from "dotenv";
import { execSync } from "node:child_process";

config({ path: ".env.local" });

const ENV_KEYS = [
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "FIREBASE_ADMIN_PROJECT_ID",
] as const;

const TARGET_ENVS = ["production", "preview", "development"] as const;

function run(command: string) {
  execSync(command, { stdio: "inherit", env: process.env });
}

function removeEnv(key: string, target: string) {
  try {
    run(`vercel env rm ${key} ${target} --yes`);
  } catch {
    // zmienna mogła nie istnieć
  }
}

function addEnv(key: string, value: string, target: string) {
  run(`printf '%s' ${JSON.stringify(value)} | vercel env add ${key} ${target}`);
}

function main() {
  const missing = ENV_KEYS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Brak wartości w .env.local: ${missing.join(", ")}`);
  }

  console.log("Synchronizuję zmienne środowiskowe z Vercel...\n");

  for (const key of ENV_KEYS) {
    const value = process.env[key]!;
    console.log(`→ ${key}`);

    for (const target of TARGET_ENVS) {
      removeEnv(key, target);
      addEnv(key, value, target);
    }
  }

  console.log("\nGotowe — zmienne ustawione dla production, preview i development.");
}

main();
