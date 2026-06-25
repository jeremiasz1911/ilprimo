import { config } from "dotenv";
import { seedFullSite } from "../lib/seed-service";

config({ path: ".env.local" });

async function main() {
  console.log("Importuję pełną zawartość strony IL PRIMO do Firestore...\n");

  const result = await seedFullSite();

  console.log("Gotowe!\n");
  console.log(`  Sekcje strony:     ${result.sections}`);
  console.log(`  Ustawienia:        ${result.settings ? "tak" : "nie"}`);
  console.log(`  Kategorie menu:    ${result.categories}`);
  console.log(`  Dania:             ${result.dishes}`);
  console.log("\nStrona powinna wyglądać jak wcześniej — treści są teraz w CMS.");
}

main().catch((error) => {
  console.error("Błąd importu:", error instanceof Error ? error.message : error);
  process.exit(1);
});
