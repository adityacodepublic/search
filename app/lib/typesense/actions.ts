"use server";

import { SearchParams } from "typesense/lib/Typesense/Types";
import { client } from "./client";

export async function typesenseSearch(query: string): Promise<any> {
  let searchParameters: SearchParams<object, string> = {
    q: query,
    query_by: "name,address,pin_code,source",
    query_by_weights: "4,3,2,1", // precedence: name > address > pin_code > source
    num_typos: 2, // allow up to 2 typos
    min_len_1typo: 2,
    min_len_2typo: 5,
    split_join_tokens: "always", // allows 'newyork' or 'nw york' to still match
    per_page: 15,
  };

  const result = client
    .collections("dealerships")
    .documents()
    .search(searchParameters);

  return result;
}

export async function typesenseSemanticSearch(query: string): Promise<any> {
  let searchParameters: SearchParams<object, string> = {
    q: query,
    query_by: "embedding",
    exclude_fields: "embedding",
    per_page: 15,
  };

  const result = client
    .collections("semanticDealerships")
    .documents()
    .search(searchParameters);

  return result;
}
