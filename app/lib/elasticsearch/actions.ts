"use server";

// PAGINATION
// https://www.elastic.co/docs/reference/elasticsearch/rest-apis/paginate-search-results

export async function elasticSearch(query: string): Promise<any> {
  const index = "dealerships";
  const body = {
    // from: 5,
    size: 15,
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

  const url = `http://localhost:9200/${index}/_search`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "ApiKey ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}

export async function elasticSemanticSearch(query: string): Promise<any> {
  const semanticIndex = "dealerships_semantic";

  const body = {
    size: 15,
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
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "ApiKey ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}

export async function elasticHybridSearch(query: string): Promise<any> {
  const semanticIndex = "dealerships_hybrid";

  const body = {
    retriever: {
      rrf: {
        retrievers: [
          {
            standard: {
              query: {
                multi_match: {
                  query: query,
                  fields: [
                    "name",
                    "address",
                    "pin_code",
                    "city",
                    "state",
                    "country",
                    "timezone",
                    "source",
                  ],
                },
              },
            },
          },
          {
            standard: {
              query: {
                semantic: {
                  field: "semantic_text",
                  query: query,
                },
              },
            },
          },
        ],
        rank_window_size: 15,
      },
    },
  };

  const url = `http://localhost:9200/${semanticIndex}/_search`;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "ApiKey ZVhreE9ab0JwdWpsMHctTTBxY1A6bnhEWWxuVl9NSXpKU1dDWEU5dnJFdw==",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}
