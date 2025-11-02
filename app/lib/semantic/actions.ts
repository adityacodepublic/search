"use server";
import { supabase } from "./pgClient";
import { generateEmbedding } from "./embed";

/**
 * Semantic search using the RPC function defined in SQL (match_my_table_embeddings)
 * It returns rows from my_table_embeddings with similarity scores.
 */
export async function semanticSearchByEmbedding(
  embedding: number[],
  limit = 20
) {
  const { data, error } = await supabase.rpc("match_my_table_embeddings", {
    query_vector: embedding,
    limit_result: limit,
  });

  if (error) throw error;
  return data ?? [];
}

/**
 * Combined flow: try keyword first, then fall back to semantic when keyword returns nothing.
 */
export async function semanticSearch(
  searchTerm: string,
  itemsPerTableLimit = 20
) {
  const { embedding } = await generateEmbedding(searchTerm);
  const semanticResults = await semanticSearchByEmbedding(
    embedding,
    itemsPerTableLimit
  );

  const semanticResult = semanticResults.map((r: any) => {
    return JSON.parse(r.content);
  });

  return semanticResult;
}
