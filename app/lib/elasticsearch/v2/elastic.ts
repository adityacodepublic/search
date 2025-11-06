// Search api https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-match-query
//            https://www.elastic.co/docs/reference/elasticsearch/rest-apis/common-options#fuzziness
// Mapping    https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/mapping-parameters

import path from "path";
import { readFile } from "fs/promises";
import { Client } from "@elastic/elasticsearch";
// import { flattenCompanyRecord } from "../../semantic/embed";

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    apiKey: "ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
  },
});

const index = "dealerships_v2";

// clean data
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
      return { ...base };
    }
  );

  return cleaned;
}

// create index
function createIndex() {
  const data = processFile();
  client.indices.create({
    index: index,
    mappings: {
      dynamic: "false",
      properties: {
        // semantic_content: {
        //   type: "semantic_text",
        // },
        name: { type: "text" },
        address: { type: "text" },
        pin_code: { type: "text" },
        city: { type: "text" },
        state: { type: "text" },
        country: { type: "text" },
        timezone: { type: "text" },
        source: { type: "text" },
      },
    },
  });
}

// seed data
async function seedData() {
  const data = await processFile();
  const body = data.flatMap((doc) => [{ index: { _index: index } }, doc]);

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

// search dealerships
export async function searchDealerships(query: string) {
  const body = {
    query: {
      bool: {
        should: [
          { match: { name: { query, fuzziness: "AUTO", boost: 4 } } },
          { match: { address: { query, fuzziness: "AUTO", boost: 3 } } },
          { match: { pin_code: { query, fuzziness: "AUTO", boost: 2 } } },
          { match: { source: { query, fuzziness: "AUTO", boost: 1 } } },
          // { match: { semantic_content: { query, fuzziness: "AUTO", boost: 5 } } },
          // { match: { id: { query, fuzziness: "AUTO", boost: 4 } } },
        ],
        // minimum_should_match: 1,
      },
    },
  };

  const url = `http://localhost:9200/${index}/_search`;
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

searchDealerships("the city whose name is New yrk")
  .then((hits) => console.log(hits))
  .catch(console.error);

// createIndex();
// seedData();

// npx ts-node app/lib/elasticsearch/v2/elastic.ts