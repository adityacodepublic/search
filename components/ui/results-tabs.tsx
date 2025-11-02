"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ResultCard } from "./resultCard";
import { CompanyRecord } from "@/app/lib/semantic/embed";

export interface ResultsTabsProps {
  results: CompanyRecord[];
  className?: string;
}

function normalizeSource(source?: string) {
  return (source && source.trim()) || "Unknown";
}

export function ResultsTabs({ results, className }: ResultsTabsProps) {
  const tabs = useMemo(() => {
    const unique = new Set<string>();
    results.forEach((r) => unique.add(normalizeSource(r.source)));
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [results]);

  const [active, setActive] = useState<string>(tabs[0] ?? "All");

  const filtered = useMemo(() => {
    if (active === "All") return results;
    return results.filter((r) => normalizeSource(r.source) === active);
  }, [active, results]);

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-4", className)}>
      {/* Tabs */}
      <div
        className={cn(
          "w-full relative bg-white dark:bg-zinc-800 rounded-full overflow-hidden",
          "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]"
        )}
      >
        <div className="flex gap-1 p-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-black text-white dark:bg-zinc-900"
                    : "text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-700"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div
          className={cn(
            "w-full relative bg-white dark:bg-zinc-800 rounded-xl p-8 text-center",
            "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]"
          )}
        >
          <p className="text-sm text-neutral-600 dark:text-zinc-300">
            No results for this tab.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, idx) => (
            <ResultCard key={r.id ?? `${active}-${idx}`} {...r} />
          ))}
        </div>
      )}
    </div>
  );
}
