import { SearchParams } from "typesense/lib/Typesense/Types";
import { client } from "./client";

// import fs from "fs/promises";

// COLLECTIONS
// https://typesense.org/docs/29.0/api/collections.html

// DELETE COLLECTION
// client.collections('dealerships').delete();

// CREATE COLLECTION
// let dealershipSchema = {
//   name: "dealerships",
//   fields: [
//     { name: "name", type: "string" },
//     { name: "address", type: "string" },
//     { name: "pin_code", type: "string" },
//     { name: "source", type: "string", facet: true },
//     { name: "city", type: "string", facet: true },
//     { name: "state", type: "string", facet: true },
//     { name: "country", type: "string", facet: true },
//     { name: "timezone", type: "string", facet: true },
//   ],
// } as any;

// client
//   .collections()
//   .create(dealershipSchema)
//   .then((data: any) => {
//     console.log(data);
//   })
//   .catch((error: any) => {
//     console.error(error);
//   });

// ADD DATA TO COLLECTIONS
// const dealership = await fs.readFile("/Users/rocked/Documents/elastic-Search/search/learnings/dealerships.jsonl", "utf-8");
// // console.log(dealership)

// client
//   .collections("dealerships")
//   .documents()
//   .import(dealership, {action: "create"})
//   .then((data: any) => {
//     console.log(data);
//   })
//   .catch((error: any) => {
//     console.error(error);
//   });

// RETRIEVE COLLECTIONS SCHEMA
// client.collections('dealerships').retrieve().then(function (collection: any) {
//   console.log(collection);
// });

let searchParameters: SearchParams<object, string> = {
  q: "the city whose name is nw york",
  query_by: "name,address,pin_code,source",
  query_by_weights: "4,3,2,1", // precedence: name > address > pin_code > source
  num_typos: 4, 
  min_len_1typo: 2,
  min_len_2typo: 5,
  split_join_tokens: "always", // allows 'newyork' or 'nw york' to still match
};

client
  .collections("dealerships")
  .documents()
  .search(searchParameters)
  .then(function (searchResults: any) {
    console.log(JSON.stringify(searchResults, null, 2));
  });
