"use client";

import type { CSSProperties, MouseEvent } from "react";

import { cn } from "@donationwatch/ui/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

import { useClientTranslations } from "@/hooks/use-client-translations";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface TocHeaderMeta {
  label?: string;
  title: string;
  badge?: string;
  color?: string;
  subtitle?: string;
  stats?: string;
}

interface IndicatorPosition {
  top: number;
  height: number;
  ready: boolean;
}

const EMPTY_INDICATOR: IndicatorPosition = {
  top: 0,
  height: 0,
  ready: false,
};

function supportsNativeScrollTargetGroup(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("scroll-target-group: auto")
  );
}

function computeActiveIdFromHeadings(items: TocItem[]): string | null {
  if (items.length === 0) return null;

  if (
    window.innerHeight + Math.ceil(window.scrollY) >=
    document.documentElement.scrollHeight - 24
  ) {
    return items[items.length - 1].id;
  }

  let currentId: string | null = null;
  for (const item of items) {
    const element = document.getElementById(item.id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= 140) {
      currentId = item.id;
    }
  }

  return currentId ?? items[0].id;
}

/**
 * Sticky right-side Table of Contents with native `scroll-target-group`
 * scrollspy, `IntersectionObserver` fallback, and smooth click navigation.
 */
export const PageToc = ({
  items,
  title,
  header,
  className,
}: {
  items?: TocItem[];
  title?: string;
  header?: TocHeaderMeta;
  className?: string;
}) => {
  const t = useClientTranslations("navigation");
  const headingId = useId();
  const asideRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const discoveredKeyRef = useRef("");
  const domHeaderKeyRef = useRef("");
  const clickLockRef = useRef<{
    id: string;
    timeout: ReturnType<typeof setTimeout>;
  } | null>(null);

  const [discoveredItems, setDiscoveredItems] = useState<TocItem[]>([]);
  const [domHeader, setDomHeader] = useState<TocHeaderMeta | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHeaderOutOfView, setIsHeaderOutOfView] = useState(false);
  const [indicator, setIndicator] =
    useState<IndicatorPosition>(EMPTY_INDICATOR);

  const resolvedItems = items ?? discoveredItems;
  const resolvedHeader: TocHeaderMeta | null =
    domHeader ?? (header ? header : title ? { title } : null);
  const hasHeaderTitle = Boolean(resolvedHeader?.title);
  const isVisible = resolvedItems.length >= 2;

  useEffect(() => {
    if (!hasHeaderTitle) {
      setIsHeaderOutOfView(false);
      return;
    }

    const root =
      asideRef.current?.closest("[data-toc-root]") ??
      asideRef.current?.closest("article") ??
      document.body;
    const headerEl =
      root.querySelector("#hero-label") ??
      root.querySelector("[data-page-header]");
    if (!headerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsHeaderOutOfView(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );
    observer.observe(headerEl);

    return () => {
      observer.disconnect();
    };
  }, [hasHeaderTitle]);

  useEffect(() => {
    if (items) return;

    const root =
      asideRef.current?.closest("[data-toc-root]") ??
      asideRef.current?.closest("article") ??
      document.querySelector("article");
    if (!root) return;

    const collectHeadings = () => {
      const selector =
        root.tagName === "ARTICLE"
          ? "h1[id][data-toc-title], h2[id], h3[id]"
          : "article h1[id][data-toc-title], article h2[id], article h3[id]";
      const headings = root.querySelectorAll<HTMLHeadingElement>(selector);
      const next: TocItem[] = [];
      for (const el of headings) {
        const id = el.id.trim();
        const itemTitle =
          el.getAttribute("data-toc-title")?.trim() ||
          el.textContent?.trim() ||
          "";
        if (!id || !itemTitle) continue;
        next.push({
          id,
          title: itemTitle,
          level: el.tagName === "H3" ? 3 : 2,
        });
      }

      const nextKey = next
        .map((item) => `${item.id}:${item.level}:${item.title}`)
        .join("|");
      if (nextKey !== discoveredKeyRef.current) {
        discoveredKeyRef.current = nextKey;
        setDiscoveredItems(next);
      }

      const headerMetaEl = root.querySelector<HTMLElement>("[data-toc-header]");
      const titleAttr =
        headerMetaEl?.getAttribute("data-toc-header-title")?.trim() || "";
      const nextHeader: TocHeaderMeta | null = titleAttr
        ? {
            label:
              headerMetaEl?.getAttribute("data-toc-header-label")?.trim() ||
              undefined,
            title: titleAttr,
            badge:
              headerMetaEl?.getAttribute("data-toc-header-badge")?.trim() ||
              undefined,
            color:
              headerMetaEl?.getAttribute("data-toc-header-color")?.trim() ||
              undefined,
            subtitle:
              headerMetaEl?.getAttribute("data-toc-header-subtitle")?.trim() ||
              undefined,
            stats:
              headerMetaEl?.getAttribute("data-toc-header-stats")?.trim() ||
              undefined,
          }
        : null;
      const nextHeaderKey = JSON.stringify(nextHeader);
      if (nextHeaderKey !== domHeaderKeyRef.current) {
        domHeaderKeyRef.current = nextHeaderKey;
        setDomHeader(nextHeader);
      }
    };

    collectHeadings();

    const observer = new MutationObserver(collectHeadings);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "id",
        "data-toc-title",
        "data-toc-header-label",
        "data-toc-header-title",
        "data-toc-header-badge",
        "data-toc-header-color",
        "data-toc-header-subtitle",
        "data-toc-header-stats",
      ],
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    if (resolvedItems.length === 0) {
      setActiveId(null);
      return;
    }

    const supportsNative = supportsNativeScrollTargetGroup();
    let rafId = 0;

    const applyDomState = (nextId: string | null) => {
      const container = linksRef.current;
      if (!container) return;
      container
        .querySelectorAll<HTMLAnchorElement>("a[data-toc-link]")
        .forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${nextId}`;
          link.setAttribute("aria-current", isCurrent ? "true" : "false");
        });
    };

    const syncActiveState = () => {
      if (clickLockRef.current) {
        const lockedId = clickLockRef.current.id;
        setActiveId((prev) => (prev === lockedId ? prev : lockedId));
        applyDomState(lockedId);
        return;
      }

      let nextId: string | null = null;
      if (supportsNative) {
        const nativeTarget =
          linksRef.current?.querySelector<HTMLAnchorElement>(
            "a:target-current",
          );
        const nativeId = nativeTarget?.getAttribute("href")?.slice(1) ?? null;
        if (nativeId && resolvedItems.some((item) => item.id === nativeId)) {
          nextId = nativeId;
        }
      }

      if (!nextId) {
        nextId = computeActiveIdFromHeadings(resolvedItems);
      }

      setActiveId((prev) => (prev === nextId ? prev : nextId));
      applyDomState(nextId);
    };

    const scheduleSync = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        syncActiveState();
      });
    };

    const handleScrollEnd = () => {
      if (clickLockRef.current) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          return;
        }
        clearTimeout(clickLockRef.current.timeout);
        clickLockRef.current = null;
      }
      syncActiveState();
    };

    syncActiveState();

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    document.addEventListener("scrollend", handleScrollEnd, { passive: true });

    let intersectionObserver: IntersectionObserver | null = null;
    if (!supportsNative) {
      intersectionObserver = new IntersectionObserver(scheduleSync, {
        rootMargin: "-140px 0px -60% 0px",
        threshold: 0,
      });

      for (const item of resolvedItems) {
        const target = document.getElementById(item.id);
        if (target) {
          intersectionObserver.observe(target);
        }
      }
    }

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (clickLockRef.current) {
        clearTimeout(clickLockRef.current.timeout);
        clickLockRef.current = null;
      }
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      document.removeEventListener("scrollend", handleScrollEnd);
      intersectionObserver?.disconnect();
    };
  }, [resolvedItems]);

  useEffect(() => {
    const container = linksRef.current;
    if (!container || !activeId || !isVisible) {
      setIndicator((prev) => (prev.ready ? EMPTY_INDICATOR : prev));
      return;
    }

    const measure = () => {
      const links =
        container.querySelectorAll<HTMLAnchorElement>("a[data-toc-link]");
      const activeLink = Array.from(links).find(
        (link) => link.getAttribute("href") === `#${activeId}`,
      );
      if (!activeLink) {
        setIndicator((prev) => (prev.ready ? EMPTY_INDICATOR : prev));
        return;
      }

      const top = activeLink.offsetTop;
      const height = activeLink.offsetHeight;
      if (height === 0) return;

      setIndicator((prev) =>
        prev.ready && prev.top === top && prev.height === height
          ? prev
          : { top, height, ready: true },
      );
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeId, isVisible, resolvedItems]);

  const handleLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();

    if (clickLockRef.current) {
      clearTimeout(clickLockRef.current.timeout);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timeout = setTimeout(
      () => {
        clickLockRef.current = null;
      },
      prefersReducedMotion ? 150 : 800,
    );

    clickLockRef.current = { id, timeout };
    setActiveId(id);

    const container = linksRef.current;
    if (container) {
      container
        .querySelectorAll<HTMLAnchorElement>("a[data-toc-link]")
        .forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${id}`;
          link.setAttribute("aria-current", isCurrent ? "true" : "false");
        });
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const handleScrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    if (window.location.hash) {
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  return (
    <div
      ref={asideRef}
      className={cn(
        "sticky top-6 hidden w-48 shrink-0 self-start pt-6 xl:block 2xl:w-56",
        className,
      )}
    >
      {isVisible ? (
        <nav aria-labelledby={headingId}>
          {resolvedHeader ? (
            <div
              aria-hidden={!isHeaderOutOfView}
              className={cn(
                "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
                isHeaderOutOfView
                  ? "mb-3 grid-rows-[1fr] opacity-100"
                  : "pointer-events-none mb-0 grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <button
                  type="button"
                  tabIndex={isHeaderOutOfView ? 0 : -1}
                  onClick={handleScrollToTop}
                  title={resolvedHeader.title}
                  className="group/toc-head w-full space-y-0.5 border-b border-zinc-200 pb-2.5 text-left transition-colors dark:border-zinc-800"
                >
                  {resolvedHeader.label ? (
                    <div className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {resolvedHeader.label}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-1.5">
                    {resolvedHeader.color ? (
                      <span
                        aria-hidden="true"
                        className="size-2.5 shrink-0 rounded-full border border-transparent dark:border-zinc-700"
                        style={{ backgroundColor: resolvedHeader.color }}
                      />
                    ) : null}
                    <span className="truncate font-semibold text-zinc-900 transition-colors group-hover/toc-head:text-zinc-950 dark:text-zinc-100 dark:group-hover/toc-head:text-white">
                      {resolvedHeader.title}
                    </span>
                    {resolvedHeader.badge ? (
                      <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {resolvedHeader.badge}
                      </span>
                    ) : null}
                  </div>
                  {resolvedHeader.subtitle ? (
                    <div className="truncate text-sm text-zinc-600 dark:text-zinc-300">
                      {resolvedHeader.subtitle}
                    </div>
                  ) : null}
                  {resolvedHeader.stats ? (
                    <div className="truncate text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
                      {resolvedHeader.stats}
                    </div>
                  ) : null}
                </button>
              </div>
            </div>
          ) : null}
          <div
            id={headingId}
            className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            {t("on_this_page")}
          </div>
          <div className="relative max-h-[calc(100vh-6rem)] min-h-0 [scrollbar-width:none] overflow-x-clip overflow-y-auto overscroll-contain mask-[linear-gradient(to_bottom,transparent,white_8px,white_calc(100%-8px),transparent)] py-2 text-sm">
            <div
              ref={linksRef}
              className="relative flex flex-col"
              style={{ scrollTargetGroup: "auto" } as CSSProperties}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-0 w-px bg-zinc-200 dark:bg-zinc-800"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute start-0 w-0.5 rounded-full bg-zinc-950 transition-all duration-300 ease-out dark:bg-white"
                style={{
                  top: `${indicator.top}px`,
                  height: `${indicator.height}px`,
                  opacity: indicator.ready ? 1 : 0,
                }}
              />
              {resolvedItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    data-toc-link=""
                    data-active={isActive ? "true" : "false"}
                    aria-current={isActive ? "true" : "false"}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    className="group relative scroll-m-4 py-1.5 pe-2 text-sm text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 data-[active=true]:font-medium data-[active=true]:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 dark:data-[active=true]:text-white"
                    style={{
                      paddingInlineStart: item.level > 2 ? "20px" : "12px",
                    }}
                  >
                    {item.title}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      ) : null}
    </div>
  );
};
