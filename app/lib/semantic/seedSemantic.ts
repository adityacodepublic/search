import { seedEmbeddings2 } from "./embed";
import { readFile, writeFile } from "fs/promises";
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
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Output path for embeddings
    const outputPath = path.join(process.cwd(), "learnings", "embeddings.json");

    // Try to load existing results so we can resume without overwriting
    let res: any[] = [];
    try {
      const existing = await readFile(outputPath, "utf-8");
      res = JSON.parse(existing) as any[];
      console.log(
        `Found existing embeddings file with ${res.length} records. Will resume from there unless START_INDEX is set.`
      );
    } catch (err: any) {
      if (err && err.code === "ENOENT") {
        // file doesn't exist, start fresh
        res = [];
      } else {
        console.warn(
          "Could not read existing embeddings file, starting fresh:",
          err?.message ?? err
        );
        res = [];
      }
    }

    // Seed in batches to avoid overloading
    const BATCH_SIZE = 100;
    // Resume index: prefer explicit START_INDEX env var, otherwise continue from saved results length
    const startIndexEnv = process.env.START_INDEX;
    const startIndex = startIndexEnv ? Number(startIndexEnv) : res.length || 0;

    for (let i = startIndex; i < cleanedDealerships.length; i += BATCH_SIZE) {
      const batch = cleanedDealerships.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      console.log(
        `Seeding batch ${batchNumber} (records ${i}..${
          i + batch.length - 1
        }) with ${batch.length} records...`
      );

      try {
        const result = await seedEmbeddings2(batch);
        // Merge with existing saved results and write out the combined array so restarting will resume
        res = res.concat(result);

        // Persist merged results. We intentionally overwrite with merged array (not truncate) so
        // previous results are preserved and the file effectively grows by appending new records.
        await writeFile(outputPath, JSON.stringify(res, null, 2), "utf-8");

        console.log(
          `Batch ${batchNumber} seeded and saved (${res.length} total records).`
        );
      } catch (batchErr) {
        console.error(`Error while seeding batch ${batchNumber}:`, batchErr);
        console.error(
          `Saved ${res.length} records so far to ${outputPath}. You can restart and the script will resume from that point.`
        );
        // Re-throw so outer catch can handle exit(1)
        throw batchErr;
      }

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
