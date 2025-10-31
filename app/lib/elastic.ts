import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "http://127.0.0.1:9200",
  auth: {
    apiKey: "ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
  },
});

const index = "dealerships";

export async function searchDealerships(query: string) {
  const body = {
    query: {
      bool: {
        should: [
          { match: { name: { query, fuzziness: "AUTO", boost: 4 } } },
          { match: { address: { query, fuzziness: "AUTO", boost: 3 } } },
          { match: { pin_code: { query, fuzziness: "AUTO", boost: 2 } } },
          { match: { source: { query, fuzziness: "AUTO", boost: 1 } } },
        ],
      },
    },
  };

  // Using fetch instead of client due to connection issues
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

// Example usage (remove or comment out in production)
searchDealerships("Nw york")
  .then((hits) => console.log(hits))
  .catch(console.error);
