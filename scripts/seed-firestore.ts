import { config } from "dotenv";
import { seedFirestoreFromMenuData } from "../lib/menu-service";

config({ path: ".env.local" });

async function main() {
  const result = await seedFirestoreFromMenuData();
  console.log(
    `Zaimportowano ${result.categories} kategorii i ${result.dishes} dań do Firestore.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
