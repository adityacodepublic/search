import { supabase } from "./pgClient";
import { generateEmbedding } from "./embed";

/**
 * Simple keyword search (ILIKE). Replace or augment with full-text search if preferred.
 */
// export async function keywordSearch(q: string, limit = 20) {
//   const ilike = `%${q}%`;
//   const { data, error } = await supabase
//     .from("my_table")
//     .select("id, title, description, created_at")
//     .or(`title.ilike.${ilike},description.ilike.${ilike}`)
//     .limit(limit);

//   if (error) throw error;
//   return data ?? [];
// }

/**
 * Semantic search using the RPC function defined in SQL (match_my_table_embeddings)
 * It returns rows from my_table_embeddings with similarity scores.
 */
export async function semanticSearchByEmbedding(embedding: number[], limit = 20) {
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
export async function combinedSearch(searchTerm: string, itemsPerTableLimit = 20) {
//   const shouldUseSemanticFallback =
//     !!searchTerm && searchTerm.trim().split(/\s+/).length > 1;

//   const keywordResults = await keywordSearch(searchTerm, itemsPerTableLimit);

//   if (shouldUseSemanticFallback && (!keywordResults || keywordResults.length === 0)) {
    // Optionally call an LLM to produce structured filters. For now we embed the raw searchTerm.
    const { embedding } = await generateEmbedding(searchTerm);
    const semanticResults = await semanticSearchByEmbedding(embedding, itemsPerTableLimit);

    const semanticResult = semanticResults.map((r:any) => {
        return JSON.parse(r.content)
    });

    return semanticResult;
//   }

//   return keywordResults;
}


console.log(await combinedSearch("BMW dealership in New Yrk", 10));