import { seedEmbeddings } from "./embed";
import { readFile } from "fs/promises";
import path from "path";

async function main() {
  try {
    const filePath = path.join(process.cwd(), "learnings", "dealerships.json");
    const data = await readFile(filePath, "utf-8");
    const dealerships = JSON.parse(data) as any[];
    const cleanedDealerships = dealerships.map(
      ({
        id,
        name,
        address,
        pin_code,
        city,
        state,
        country,
        timezone,
        hubspot_id,
        source,
        created_at,
        updated_at,
        parent_dealership_id,
        children_dealership_ids,
      }) => ({
        id,
        name,
        address,
        pin_code,
        city,
        state,
        country,
        timezone,
        hubspot_id,
        source,
        created_at,
        updated_at,
        parent_dealership_id,
        children_dealership_ids,
      })
    );

    console.log(`Loaded ${cleanedDealerships.length} dealerships`);
    const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

    // Seed in batches to avoid overloading
    const BATCH_SIZE = 100;
    for (let i = 300; i < cleanedDealerships.length; i += BATCH_SIZE) {
      const batch = cleanedDealerships.slice(i, i + BATCH_SIZE);
      console.log(`Seeding batch ${i / BATCH_SIZE + 1} with ${batch.length} records...`);
      await seedEmbeddings(batch);
      console.log(`Batch ${i / BATCH_SIZE + 1} seeded.`);
      // Optional delay between batches
      await delay(10000);
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

main();
