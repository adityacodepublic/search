const Typesense = require("typesense");
// import fs from "fs/promises";

let client = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: "xyz",
  connectionTimeoutSeconds: 2,
});

// COLLECTIONS
// https://typesense.org/docs/29.0/api/collections.html

// client.collections('dealerships').delete();

// let dealershipSchema = {
//   name: "dealerships",
//   fields: [
//     { name: "name", type: "string" },
//     { name: "address", type: "string" },
//     { name: "pin_code", type: "string", facet: true },
//     { name: "source", type: "string", facet: true },
//     // optional: add an ID or ranking field
//     { name: "id", type: "int32" },
//   ],
// };

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

let searchParameters = {
  q: "the rocked nw york 10001",
  query_by: "name,address,pin_code,source",
  query_by_weights: "4,3,2,1", // precedence: name > address > pin_code > source
  num_typos: 2, // allow up to 2 typos
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
