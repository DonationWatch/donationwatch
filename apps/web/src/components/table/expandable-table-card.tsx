"use client";

import { Card } from "@donationwatch/ui/components/card";
import { cn } from "@donationwatch/ui/lib/utils";
import { Expand, X } from "lucide-react";
import dynamic from "next/dynamic";
import {
  type ComponentProps,
  type PropsWithChildren,
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

const ExpandedChartDialog = dynamic(
  () =>
    import("@/components/charts/expanded-chart-dialog").then(
      (mod) => mod.ExpandedChartDialog,
    ),
  { ssr: false },
);

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface TableCardState {
  isExpanded: boolean;
}

export interface TableCardActions {
  setIsExpanded: (open: boolean) => void;
  toggleExpanded: () => void;
}

export interface TableCardMeta {
  title?: string;
  inDialog: boolean;
}

export interface TableCardContextValue {
  state: TableCardState;
  actions: TableCardActions;
  meta: TableCardMeta;
}

const TableCardContext = createContext<TableCardContextValue | null>(null);

function useTableCardContext(): TableCardContextValue {
  const ctx = use(TableCardContext);
  if (!ctx) {
    throw new Error(
      "TableCard subcomponents must be used within TableCard.Provider",
    );
  }
  return ctx;
}

const TableCardProvider = ({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <TableCardContext
      value={{
        state: { isExpanded },
        actions: { setIsExpanded, toggleExpanded },
        meta: { title, inDialog: false },
      }}
    >
      {children}
    </TableCardContext>
  );
};

const TableCardFrame = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  const ctx = useTableCardContext();
  const {
    state: { isExpanded },
    actions: { setIsExpanded },
    meta: { title },
  } = ctx;
  const frameRef = useRef<HTMLElement>(null);
  const [placeholderHeight, setPlaceholderHeight] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (isExpanded) return;
    const el = frameRef.current;
    if (!el) return;

    const updateHeight = () => {
      const nextHeight = el.offsetHeight;
      if (nextHeight > 0) {
        setPlaceholderHeight((prev) =>
          prev === nextHeight ? prev : nextHeight,
        );
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isExpanded]);

  return (
    <>
      <Card
        padding="none"
        style={
          isExpanded && placeholderHeight
            ? { height: `${placeholderHeight}px` }
            : undefined
        }
        render={
          <section
            ref={frameRef}
            className={cn(
              "flex h-full w-full flex-col items-start justify-center in-data-[toc-root]:xl:-mx-6 in-data-[toc-root]:xl:w-[calc(100%+3rem)] in-data-[toc-root]:2xl:-mx-12 in-data-[toc-root]:2xl:w-[calc(100%+6rem)]",
              className,
            )}
          />
        }
      >
        {isExpanded ? (
          <div
            aria-hidden="true"
            className="h-full w-full animate-pulse rounded-xs bg-zinc-100/60 dark:bg-zinc-800/40"
          />
        ) : (
          <div className="flex h-full w-full flex-col p-0.5">
            <div className="flex min-h-0 w-full flex-1 flex-col">
              {children}
            </div>
          </div>
        )}
      </Card>
      {isExpanded ? (
        <ExpandedChartDialog
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          title={title}
        >
          <TableCardContext
            value={{ ...ctx, meta: { ...ctx.meta, inDialog: true } }}
          >
            <div className="flex min-h-0 flex-1 flex-col p-0.5">
              <div className="flex min-h-0 w-full flex-1 flex-col">
                {children}
              </div>
            </div>
          </TableCardContext>
        </ExpandedChartDialog>
      ) : null}
    </>
  );
};

const TableCardHeader = ({
  title,
  description,
  titleId,
  titleAs = "h2",
  children,
}: PropsWithChildren<{
  title?: string;
  description?: string;
  titleId?: string;
  titleAs?: HeadingTag;
}>) => {
  const {
    meta: { inDialog },
  } = useTableCardContext();
  const HeadingTag = titleAs;

  if (!title && !description && !children) return null;

  return (
    <header className="flex w-full shrink-0 p-4 pt-4 pb-2">
      {title || description ? (
        <div className="grow space-y-2">
          {title ? (
            !inDialog && titleId ? (
              <HeadingTag
                id={titleId}
                data-toc-title={title}
                className="scroll-mt-4 text-base/5 font-semibold"
              >
                <a href={`#${titleId}`}>{title}</a>
              </HeadingTag>
            ) : (
              <div className="text-base/5 font-semibold">{title}</div>
            )
          ) : null}
          {description ? <p className="text-sm">{description}</p> : null}
        </div>
      ) : null}
      <div className="flex shrink-0 items-start">{children}</div>
    </header>
  );
};

const TableCardToolbar = ({ children }: PropsWithChildren) => {
  return <div className="w-full shrink-0 px-4 pb-3">{children}</div>;
};

const TableCardExpandTool = () => {
  const {
    state: { isExpanded },
    actions: { toggleExpanded },
  } = useTableCardContext();
  const tChart = useTranslations("chart");
  const Icon = isExpanded ? X : Expand;

  return (
    <button
      type="button"
      className="hover:text-primary-800 dark:hover:text-primary-400 cursor-pointer p-2"
      onClick={toggleExpanded}
      title={tChart("toggle_fullscreen")}
      aria-label={tChart("toggle_fullscreen")}
    >
      <Icon size={18} />
    </button>
  );
};

const TableCardScrollArea = ({
  collapsedClassName,
  expandedClassName,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  collapsedClassName?: string;
  expandedClassName?: string;
}) => {
  const {
    state: { isExpanded },
  } = useTableCardContext();

  return (
    <div
      className={cn(
        "w-full",
        isExpanded ? expandedClassName : collapsedClassName,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const TableCard = {
  Provider: TableCardProvider,
  Frame: TableCardFrame,
  Header: TableCardHeader,
  Toolbar: TableCardToolbar,
  ExpandTool: TableCardExpandTool,
  ScrollArea: TableCardScrollArea,
};
