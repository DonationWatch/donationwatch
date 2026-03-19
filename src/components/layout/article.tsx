import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/utils/classname";

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

export const Article = ({
  children,
  title,
  subtitle,
  skipTitleOffset = false,
  fullWidth = false,
}: PropsWithChildren<{
  title?: string;
  subtitle?: ReactNode;
  skipTitleOffset?: boolean;
  fullWidth?: boolean;
}>) => {
  return (
    <article className="container mx-auto flex justify-between p-4">
      <div
        className={`mx-auto mb-16 w-full space-y-6 ${fullWidth ? "" : "lg:w-10/12"}`}
      >
        {title || subtitle ? (
          <div>
            {title ? (
              <h1
                className={cn("mb-6 text-3xl", skipTitleOffset ? "" : "mt-14")}
              >
                {title}
              </h1>
            ) : null}
            {subtitle ? <div className="space-y-4">{subtitle}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </article>
  );
};

export const ArticleSectionWrapper = ({
  id,
  children,
}: PropsWithChildren<{
  id: string;
}>) => {
  return (
    <section className="space-y-4 lg:mt-4" aria-labelledby={id}>
      {children}
    </section>
  );
};

export const ArticleSectionOneColumns = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative mb-8 grid gap-8 lg:grid-cols-1 xl:gap-12">
      {children}
    </div>
  );
};
export const ArticleSectionTwoColumns = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative mb-8 grid gap-8 lg:grid-cols-2 xl:gap-12">
      {children}
    </div>
  );
};

export const ArticleSectionColumn = ({ children }: PropsWithChildren) => {
  return (
    <div className="mx-auto w-full space-y-2 lg:w-10/12 lg:w-full">
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
    <Tag id={id} className="mb-4 pt-6 text-2xl font-semibold">
      <a href={`#${id}`}>{title}</a>
    </Tag>
  );
};
