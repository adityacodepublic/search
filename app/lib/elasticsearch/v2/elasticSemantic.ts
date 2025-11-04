import path from "path";
import { readFile } from "fs/promises";
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    apiKey: "ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
  },
});

const semanticIndex = "dealerships_semantic_v2";

export function flattenCompanyRecord(data: any): string {
  const {
    name = "",
    address = "",
    pin_code = "",
    city = "",
    state = "",
    country = "",
    timezone = "",
    source = "",
  } = data;

  return (
    `Company Name: ${name}. ` +
    `Address: ${address}. ` +
    `PIN Code: ${pin_code}. ` +
    `Source: ${source}. ` +
    `City: ${city}. ` +
    `State: ${state}. ` +
    `Country: ${country}. ` +
    `Timezone: ${timezone}. `
  ).trim();
}
export async function processFile() {
  const filePath = path.join(process.cwd(), "learnings", "dealerships.json");
  const data = await readFile(filePath, "utf-8");
  const dealerships = JSON.parse(data) as any[];

  const cleaned = dealerships.map(
    ({
      id,
      name,
      address,
      pin_code,
      city,
      state,
      country,
      timezone,
      source,
    }) => {
      const base = {
        id,
        name,
        address,
        pin_code,
        city,
        state,
        country,
        timezone,
        source,
      };
      return { ...base, semantic_content: flattenCompanyRecord(base) };
    }
  );

  return cleaned;
}

// create index
export async function createSemanticIndex() {
  const data = processFile();
  client.indices.create({
    index: semanticIndex,
    settings: {
      number_of_shards: 1,
      number_of_replicas: 1,
    },
    mappings: {
      dynamic: "false",
      properties: {
        semantic_content: {
          type: "semantic_text",
        },
      },
    },
  });
}

// seed data
async function seedData() {
  const data = await processFile();
  const body = data.flatMap((doc) => [
    { index: { _index: semanticIndex } },
    doc,
  ]);

  // Send bulk request
  const { errors, items } = await client.bulk({ refresh: true, body });

  const successCount = items.filter((item) => !item.index?.error).length;
  const failCount = items.length - successCount;

  console.log(`✅ Uploaded: ${successCount} / ${items.length}`);
  if (failCount > 0) console.warn(`⚠️ Failed: ${failCount}`);

  if (errors) {
    console.error("Some documents failed:", items);
  } else {
    console.log(`✅ Inserted ${items.length} documents`);
  }
}

export async function searchDealerships(query: string) {
  const body = {
    query: {
      bool: {
        should: [
          { match: { semantic_content: { query } } },
        ],
      },
    },
  };

  const url = `http://localhost:9200/${semanticIndex}/_search`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "ApiKey ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.hits.hits;
}

async function test() {
  // console.log("Creating semantic index...");
  // await createSemanticIndex();

  // console.log("Reindexing data...");
  // const reindexResponse = await seedData();
  // console.log("Reindex response:", reindexResponse);

  console.log("Testing search...");
  const results = await searchDealerships("bmd dlrships");
  console.log("Search results:", results);
}

test().catch(console.error);
// npx ts-node app/lib/elasticsearch/elasticSemantic.ts
