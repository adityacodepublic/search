import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { supabase } from "./pgClient";

const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
if (!GOOGLE_API_KEY) throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");

const google = createGoogleGenerativeAI({ apiKey: GOOGLE_API_KEY });

const EMBEDDING_CONFIG = {
  model: google.textEmbedding("gemini-embedding-001"),
  providerOptions: {
    google: {
      outputDimensionality: 768,
      taskType: "SEMANTIC_SIMILARITY",
    },
  },
  modelName: "gemini-embedding-001",
};

export async function generateEmbedding(
  text: string
): Promise<{ embedding: number[]; model: string }> {
  const { embedding } = await embed({
    model: EMBEDDING_CONFIG.model,
    value: text,
    providerOptions: EMBEDDING_CONFIG.providerOptions,
  });
  return { embedding, model: EMBEDDING_CONFIG.modelName };
}

export async function generateEmbeddings(
  texts: string[]
): Promise<{ embeddings: number[][]; model: string }> {
  const { embeddings } = await embedMany({
    model: EMBEDDING_CONFIG.model,
    values: texts,
    providerOptions: EMBEDDING_CONFIG.providerOptions,
  });
  return { embeddings, model: EMBEDDING_CONFIG.modelName };
}

export type CompanyRecord = { [key: string]: any } & {
  name?: string;
  address?: string;
  pin_code?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  source?: string;
};

export function flattenCompanyRecord(data: CompanyRecord): string {
  const {
    name = "",
    address = "",
    pin_code = "",
    city = "",
    state = "",
    country = "",
    timezone = "",
    source = "",
  } = data;

  return (
    `Company Name: ${name}. ` +
    `Address: ${address}. ` +
    `PIN Code: ${pin_code}. ` +
    `Source: ${source}. ` +
    `City: ${city}. ` +
    `State: ${state}. ` +
    `Country: ${country}. ` +
    `Timezone: ${timezone}. `
  ).trim();
}

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
