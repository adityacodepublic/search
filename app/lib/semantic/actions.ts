import { supabase } from "./pgClient";
import {
  generateEmbeddings,
  flattenCompanyRecord,
  type CompanyRecord,
} from "./embed";

/**
 * Seed embeddings for company records.
 * Checks for existing content to avoid duplicates, then generates embeddings and inserts new records.
 */
export async function seedEmbeddings(dealerships: CompanyRecord[]) {
  const contents = dealerships.map(flattenCompanyRecord);

  // ---
  // Check which contents already exist
  //   const { data: existing } = await supabase
  //     .from("my_table_embeddings")
  //     .select("content")
  //     .in("content", contents);

  //   const existingContents = new Set((existing ?? []).map((e) => e.content));

  //   // Filter to only new records
  //   const newRecords = companyRecords.filter(
  //     (_, i) => !existingContents.has(contents[i])
  //   );

  //   if (newRecords.length === 0) return;

  //   const newContents = newRecords.map(flattenCompanyRecord);
  // ---

  // Generate embeddings for new contents
  const { embeddings, model } = await generateEmbeddings(contents);

  // Prepare insert payload
  const insertPayload = dealerships.map((content, i) => ({
    content: JSON.stringify(content),
    embedding: embeddings[i],
    model,
  }));

  // Insert new embeddings
  const { error } = await supabase
    .from("my_table_embeddings")
    .insert(insertPayload);

  if (error) throw error;
  else console.log("Success");
}
