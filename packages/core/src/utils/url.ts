export interface RouterLike {
  push: (href: string, options?: { scroll?: boolean }) => void;
}

export const replaceSearchParam = (
  router: RouterLike,
  param: string,
  value: string | undefined,
  preventScroll?: boolean,
) => {
  const url = new URL(window.location.href);
  if (typeof value === "undefined") {
    url.searchParams.delete(param);
  } else {
    url.searchParams.set(param, value);
  }
  router.push(url.toString(), preventScroll ? { scroll: false } : undefined);
};
