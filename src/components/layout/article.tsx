import type { PropsWithChildren } from "react";

import { PageToc, type TocHeaderMeta } from "@/components/layout/page-toc";
import { cn } from "@/lib/utils";

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

export const PageWithToc = ({
  children,
  tocTitle,
  tocHeader,
  tocClassName = "mt-14 pr-4",
  className = "",
}: PropsWithChildren<{
  tocTitle?: string;
  tocHeader?: TocHeaderMeta;
  tocClassName?: string;
  className?: string;
}>) => {
  return (
    <div
      data-toc-root=""
      className={cn(
        "group/toc-page container mx-auto flex items-start justify-center gap-8 xl:gap-12",
        className,
      )}
    >
      <div className="w-full max-w-[54rem] min-w-0 flex-1 xl:px-6 2xl:px-12">
        {children}
      </div>
      <PageToc title={tocTitle} header={tocHeader} className={tocClassName} />
    </div>
  );
};

export const Article = ({
  children,
  className = "",
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <article className={cn("group/article container mx-auto p-4", className)}>
      <div className="mx-auto mb-16 w-full max-w-[54rem] min-w-0 space-y-6 in-data-[toc-root]:max-w-none">
        {children}
      </div>
    </article>
  );
};

export const ArticleWithToc = ({
  children,
  tocTitle,
  tocHeader,
  tocClassName,
  className = "",
}: PropsWithChildren<{
  tocTitle?: string;
  tocHeader?: TocHeaderMeta;
  tocClassName?: string;
  className?: string;
}>) => {
  return (
    <PageWithToc
      tocTitle={tocTitle}
      tocHeader={tocHeader}
      tocClassName={tocClassName}
    >
      <Article className={className}>{children}</Article>
    </PageWithToc>
  );
};

export const WideArticle = ({
  children,
  className = "",
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <article className={cn("group/article container mx-auto p-4", className)}>
      <div className="mb-16 w-full min-w-0 space-y-6">{children}</div>
    </article>
  );
};

export const ArticleHeader = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <header data-page-header="" className={cn("mt-14 space-y-4", className)}>
      {children}
    </header>
  );
};

export const ArticleTitle = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <h1 className={cn("text-3xl font-semibold tracking-tight", className)}>
      {children}
    </h1>
  );
};

export const ArticleLead = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={cn("max-w-[54rem] space-y-4", className)}>{children}</div>
  );
};

export const ArticleSectionWrapper = ({
  id,
  children,
  className = "",
}: PropsWithChildren<{
  id: string;
  className?: string;
}>) => {
  return (
    <section
      className={cn("space-y-4 lg:mt-4", className)}
      aria-labelledby={id}
    >
      {children}
    </section>
  );
};

export const ArticleSectionOneColumns = ({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "relative mb-8 grid gap-8 lg:grid-cols-1 xl:gap-12",
        className,
      )}
    >
      {children}
    </div>
  );
};
export const ArticleSectionTwoColumns = ({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn(
        "relative mb-8 grid gap-8 lg:grid-cols-2 lg:in-data-[toc-root]:grid-cols-1 xl:gap-12 xl:in-data-[toc-root]:gap-8",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const ArticleSectionColumn = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={cn("mx-auto w-full min-w-0 space-y-2", className)}>
      {children}
    </div>
  );
};

export const ArticleSection = ({
  children,
  title,
  id = `sec-${slugify(title)}`,
}: PropsWithChildren<{
  title: string;
  id?: string;
}>) => {
  return (
    <ArticleSectionWrapper id={id}>
      <ArticleSectionTitle title={title} id={id} />
      {children}
    </ArticleSectionWrapper>
  );
};

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export const ArticleSectionTitle = ({
  title,
  id,
  as = "h2",
}: {
  title: string;
  id: string;
  as?: HeadingTag;
}) => {
  const Tag = as;
  return (
    <Tag
      id={id}
      data-toc-title={title}
      className="mb-4 scroll-mt-4 pt-6 text-2xl font-semibold tracking-tight"
    >
      <a href={`#${id}`}>{title}</a>
    </Tag>
  );
};
