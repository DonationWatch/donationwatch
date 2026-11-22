const colorClasses: Record<number, string> = {
  1: "from-yellow-100 to-yellow-200 text-yellow-950 dark:from-yellow-950/80 dark:to-yellow-900/70 dark:text-yellow-300 dark:ring-1 dark:ring-yellow-500/30",
  2: "from-gray-100 to-gray-200 text-gray-950 dark:from-zinc-800 dark:to-zinc-700/70 dark:text-zinc-200 dark:ring-1 dark:ring-zinc-600/40",
  3: "from-amber-100 to-amber-200 text-amber-950 dark:from-amber-950/80 dark:to-amber-900/60 dark:text-amber-300 dark:ring-1 dark:ring-amber-600/30",
};

export const RankBadge = ({
  rank,
  className,
}: {
  rank: number;
  className?: string;
}) => {
  return (
    <div
      aria-hidden={true}
      className={
        "inline-flex min-w-9 shrink-0 items-center justify-center rounded-md bg-linear-to-r px-1 py-1 text-center leading-none tabular-nums " +
        (colorClasses[rank] ?? "text-zinc-600 dark:text-zinc-400") +
        (className !== undefined ? ` ${className}` : " mr-2")
      }
    >
      #{rank}
    </div>
  );
};
