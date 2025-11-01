import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

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
