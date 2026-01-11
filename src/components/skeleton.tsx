import { cn } from "../utils/classname";

export const Skeleton = ({
  className,
  emphasis,
}: {
  emphasis?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        emphasis
          ? "bg-gray-400 dark:bg-gray-700"
          : "bg-gray-300 dark:bg-gray-600",
        className,
      )}
    ></div>
  );
};
