import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    apiKey: "ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
  },
});

const index = "dealerships";
const semanticIndex = "dealerships_semantic";

export async function createSemanticIndex() {
  try {
    const response = await client.indices.create({
      index: semanticIndex,
      mappings: {
        properties: {
          name: { type: "semantic_text" },
          address: { type: "semantic_text" },
          pin_code: { type: "semantic_text" },
          city: { type: "semantic_text" },
          state: { type: "semantic_text" },
          country: { type: "semantic_text" },
          timezone: { type: "semantic_text" },
          source: { type: "semantic_text" },
        },
      },
    });
    console.log("Semantic index created:", response);
  } catch (error) {
    console.error("Error creating semantic index:", error);
  }
}

export async function reindexToSemantic() {
  try {
    const response = await client.reindex({
      source: {
        index: index,
        size: 20, // Smaller batch for testing
      },
      dest: {
        index: semanticIndex,
      },
      wait_for_completion: false,
    });
    console.log("Reindex task started:", response);
    return response;
  } catch (error) {
    console.error("Error reindexing:", error);
  }
  /*
    To check the status of the reindexing task
    curl -X GET "localhost:9200/_tasks/TASK_ID" \
    -H "Authorization: ApiKey ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw=="

    Check all reindex tasks:
    curl -X GET "localhost:9200/_tasks?actions=*reindex" \
    -H "Authorization: ApiKey ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw=="

    To see all tasks:
    http://localhost:9200/_tasks
    http://localhost:9200/_ml/trained_models/.elser_model_2_linux-x86_64

  */
}

export async function searchDealerships(query: string) {
  const body = {
    query: {
      bool: {
        should: [
          { match: { name: { query } } },
          { match: { address: { query } } },
          { match: { pin_code: { query } } },
          { match: { city: { query } } },
          { match: { state: { query } } },
          { match: { country: { query } } },
          { match: { timezone: { query } } },
          { match: { source: { query } } },
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
  // const reindexResponse = await reindexToSemantic();
  // console.log("Reindex response:", reindexResponse);

  console.log("Testing search...");
  const results = await searchDealerships("the city whose name is New yrk");
  console.log("Search results:", results);
}

test().catch(console.error);
// npx ts-node app/lib/elasticsearch/elasticSemantic.ts 