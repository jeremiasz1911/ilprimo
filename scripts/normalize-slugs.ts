import { config } from "dotenv";
import { normalizeAllDishSlugs } from "../lib/menu-service";

config({ path: ".env.local" });

async function main() {
  const result = await normalizeAllDishSlugs();
  console.log(`Zaktualizowano slugi ${result.updated} dań.`);
}

main().catch((error) => {
  console.error(
    "Błąd normalizacji slugów:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
