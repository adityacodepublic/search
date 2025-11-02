import { SearchParams } from "typesense/lib/Typesense/Types";
import { client } from "./client";

import fs from "fs/promises";

// COLLECTIONS
// https://typesense.org/docs/29.0/api/collections.html

// DELETE COLLECTION
// client.collections('dealerships').delete();

// CREATE COLLECTION
// let semanticDealerships = {
//   name: "semanticDealerships",
//   fields: [
//     { name: "name", type: "string" },
//     { name: "address", type: "string" },
//     { name: "pin_code", type: "string" },
//     { name: "source", type: "string", facet: true },
//     { name: "city", type: "string", facet: true },
//     { name: "state", type: "string", facet: true },
//     { name: "country", type: "string", facet: true },
//     { name: "timezone", type: "string", facet: true },
//     {
//       name: "embedding",
//       type: "float[]",
//       embed: {
//         from: [
//           "name",
//           "address",
//           "pin_code",
//           "source",
//           "city",
//           "state",
//           "country",
//           "timezone",
//         ],
//         model_config: {
//           model_name: "ts/all-MiniLM-L12-v2",
//         },
//       },
//     },
//   ],
// } as any;

// client
//   .collections()
//   .create(semanticDealerships)
//   .then((data: any) => {
//     console.log(data);
//   })
//   .catch((error: any) => {
//     console.error(error);
//   });

// // RETRIEVE COLLECTIONS SCHEMA
// client.collections('semanticDealerships').retrieve().then(function (collection: any) {
//   console.log(collection);
// });

// ADD DATA TO COLLECTIONS
// const dealership = await fs.readFile("/Users/rocked/Documents/elastic-Search/search/learnings/dealerships.jsonl", "utf-8");
// // console.log(dealership)

// client
//   .collections("semanticDealerships")
//   .documents()
//   .import(dealership, {action: "create"})
//   .then((data: any) => {
//     console.log(data);
//   })
//   .catch((error: any) => {
//     console.error(error);
//   });

// QUERY DATA
let searchParameters: SearchParams<object, string> = {
  q: "the city whose name is nw york",
  query_by: "embedding",
  // query_by_weights: "4,3,2", // precedence: name > embedding > address
  exclude_fields: "embedding",
  // num_typos: 2, // allow up to 2 typos
  // min_len_1typo: 2,
  // min_len_2typo: 5,
  // split_join_tokens: "always", // allows 'newyork' or 'nw york' to still match
};

client
  .collections("semanticDealerships")
  .documents()
  .search(searchParameters)
  .then(function (searchResults: any) {
    console.log(JSON.stringify(searchResults, null, 2));
  });
