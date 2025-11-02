import { CompanyRecord } from "@/app/lib/semantic/embed";
import { cn } from "@/lib/utils";

export const ResultCard = ({
  id,
  name,
  address,
  pin_code,
  city,
  state,
  country,
  timezone,
  source,
}: CompanyRecord) => {
  const addressLine = [address, city, state, pin_code]
    .filter(Boolean)
    .join(", ");
  const items: { label: string; value?: string | number }[] = [
    { label: "Source", value: source },
    { label: "City", value: city },
    { label: "State", value: state },
    { label: "Country", value: country },
    { label: "Timezone", value: timezone },
    { label: "Pin Code", value: pin_code },
  ];

  return (
    <div
      className={cn(
        "w-full relative max-w-3xl mx-auto bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 p-4 sm:p-5",
        "flex flex-col"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white truncate">
            {name ?? "Name not found"}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 mt-1 truncate">
            {addressLine || "Address not found"}
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center rounded-full px-2 py-1 text-[10px] sm:text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-zinc-700/60 dark:text-zinc-200">
          {id || "Unknown"}
        </span>
      </div>

      <div className="h-px bg-neutral-100 dark:bg-zinc-700 my-3" />

      {/* Meta grid */}
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-zinc-400">
              {label}
            </dt>
            <dd className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {value ?? "Not found"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

interface ResultsCardSkeletonProps {
  title: string;
  results: CompanyRecord[];
  time: number;
}
export const ResultsCardSkeleton = ({
  title,
  results,
  time,
}: ResultsCardSkeletonProps) => {
  return (
    <div className="space-y-3 min-w-lg ">
      {/* Header with title and performance time */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-neutral-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {title}
        </h2>
        {time !== 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-zinc-400">
              Response time:
            </span>
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {time.toFixed(2)}ms
            </span>
          </div>
        )}
      </div>

      {/* Results */}
      {results.map((r, idx) => (
        <ResultCard key={r?.id ?? `-${idx}`} {...r} />
      ))}
    </div>
  );
};
