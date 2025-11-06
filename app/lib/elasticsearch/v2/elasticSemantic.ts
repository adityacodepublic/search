"use server";
import path from "path";
import { readFile } from "fs/promises";
import { Client } from "@elastic/elasticsearch";
import { generateEmbedding } from "../../semantic/embed";

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    apiKey: "ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
  },
});

const semanticIndex = "dealerships_semantic_v2";

export async function processFile() {
  const filePath = path.join(process.cwd(), "learnings", "embeddings.json");
  const data = await readFile(filePath, "utf-8");
  const dealerships = JSON.parse(data) as any[];

  return dealerships;
}

// create index
export async function createSemanticIndex() {
  const data = processFile();
  client.indices.create({
    index: semanticIndex,
    // settings: {
    //   number_of_shards: 1,
    //   number_of_replicas: 1,
    // },
    mappings: {
      dynamic: "false",
      properties: {
        embedding: {
          type: "dense_vector",
          dims: 768,
          similarity: "cosine",
        },
      },
    },
  });
}

// // seed data
// async function seedData() {
//   const data = await processFile();
//   const body = data.flatMap((doc) => [
//     { index: { _index: semanticIndex } },
//     doc,
//   ]);

//   // Send bulk request
//   const { errors, items } = await client.bulk({ refresh: true, body });

//   const successCount = items.filter((item) => !item.index?.error).length;
//   const failCount = items.length - successCount;

//   console.log(`✅ Uploaded: ${successCount} / ${items.length}`);
//   if (failCount > 0) console.warn(`⚠️ Failed: ${failCount}`);

//   if (errors) {
//     console.error("Some documents failed:", items);
//   } else {
//     console.log(`✅ Inserted ${items.length} documents`);
//   }
// }

export async function searchDealerships(query: string) {
  const embedding = await generateEmbedding(query);

  const body = {
    knn: {
      field: "embedding",
      query_vector: embedding.embedding,
      k: 10,
      num_candidates: 100,
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
    const txt = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${txt}`);
  }

  return response.json();
}

// async function test() {
//   // console.log("Creating semantic index...");
//   // await createSemanticIndex();
//   // console.log("Reindexing data...");
//   // const reindexResponse = await seedData();
//   // console.log("Reindex response:", reindexResponse);
//   // console.log("Testing search...");
//   // const results = await searchDealerships("bmd dlrships");
//   // console.log("Search results:", results);
// }

// test().catch(console.error);
// npx ts-node app/lib/elasticsearch/elasticSemantic.ts

// client.indices.delete({ index: semanticIndex }).catch((err) => {
//   console.error("Error deleting index (it may not exist yet):", err);
// });
