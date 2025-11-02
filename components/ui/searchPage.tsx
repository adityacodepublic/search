"use client";
import { useEffect, useState } from "react";
import { ResultsCardSkeleton } from "./resultCard";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

import { semanticSearch } from "@/app/lib/semantic/actions";
import {
  typesenseSearch,
  typesenseSemanticSearch,
} from "@/app/lib/typesense/actions";
import {
  elasticHybridSearch,
  elasticSearch,
  elasticSemanticSearch,
} from "@/app/lib/elasticsearch/actions";

async function measureTime<T>(
  promise: () => Promise<T>,
  transformer: (data: T) => any
): Promise<{ time: number; hits: any }> {
  const start = performance.now();
  try {
    const data = await promise();
    const time = performance.now() - start;
    return { time, hits: transformer(data) };
  } catch (error) {
    const time = performance.now() - start;
    console.error("Search error:", error);
    return { time, hits: [] };
  }
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [semantic, setSemantic] = useState({ time: 0, hits: [] });
  const [elastic, setElastic] = useState({ time: 0, hits: [] });
  const [elasticSemantic, setElasticSemantic] = useState({ time: 0, hits: [] });
  const [elasticHybrid, setElasticHybrid] = useState({ time: 0, hits: [] });
  const [typesense, setTypesense] = useState({ time: 0, hits: [] });
  const [semanticTypesense, setSemanticTypesense] = useState({
    time: 0,
    hits: [],
  });

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      (async () => {
        await measureTime(
          () => semanticSearch(searchTerm, 15),
          (res) => res
        ).then(setSemantic);
        await measureTime(
          () => elasticSearch(searchTerm),
          (res) => res.hits.hits.map((hit: any) => hit._source)
        ).then(setElastic);
        await measureTime(
          () => elasticSemanticSearch(searchTerm),
          (res) => res.hits.hits.map((hit: any) => hit._source)
        ).then(setElasticSemantic);
        await measureTime(
          () => elasticHybridSearch(searchTerm),
          (res) => res.hits.hits.map((hit: any) => hit._source)
        ).then(setElasticHybrid);
        await measureTime(
          () => typesenseSearch(searchTerm),
          (res) => res.hits.map((hit: any) => hit.document)
        ).then(setTypesense);
        await measureTime(
          () => typesenseSemanticSearch(searchTerm),
          (res) => res.hits.map((hit: any) => hit.document)
        ).then(setSemanticTypesense);
      })();
    }
  }, [searchTerm]);

  console.log(
    semantic,
    elastic,
    elasticSemantic,
    elasticHybrid,
    typesense,
    semanticTypesense
  );

  return (
    <div className="bg-zinc-50 min-h-screen flex flex-col items-center justify-center p-4 overflow-x-hidden">
      <PlaceholdersAndVanishInput
        placeholders={["the dealr in new yrk", "bmd dlrships", "bmw in txs"]}
        onChange={() => {}}
        onSubmit={(value) => {
          console.log(value);
          setSearchTerm(value);
        }}
      />
      <p className="-mt-6 mb-7 text-sm text-neutral-500">
        {searchTerm}
      </p>
      {semantic.hits.length > 0 && (
        <div className="mt-8 flex space-x-10 w-full overflow-x-auto pb-2 px-10 scroll-px-4 snap-x snap-mandatory">
          <div className="shrink-0 snap-start">
            <ResultsCardSkeleton
              title="Semantic Search (PostgreSQL + pgvector)"
              results={semantic.hits}
              time={semantic.time}
            />
          </div>
          <div className="shrink-0 snap-start">
            <ResultsCardSkeleton
              title="Elasticsearch (Full-Text Search)"
              results={elastic.hits}
              time={elastic.time}
            />
          </div>
          <div className="shrink-0 snap-start">
            <ResultsCardSkeleton
              title="Elasticsearch (Semantic Search)"
              results={elasticSemantic.hits}
              time={elasticSemantic.time}
            />
          </div>
          <div className="shrink-0 snap-start">
            <ResultsCardSkeleton
              title="Elasticsearch (Hybrid Search)"
              results={elasticHybrid.hits}
              time={elasticHybrid.time}
            />
          </div>
          <div className="shrink-0 snap-start">
            <ResultsCardSkeleton
              title="Typesense (Full-Text Search)"
              results={typesense.hits}
              time={typesense.time}
            />
          </div>
          <div className="shrink-0 snap-start">
            <ResultsCardSkeleton
              title="Typesense (Semantic Search)"
              results={semanticTypesense.hits}
              time={semanticTypesense.time}
            />
          </div>
        </div>
      )}
    </div>
  );
}
