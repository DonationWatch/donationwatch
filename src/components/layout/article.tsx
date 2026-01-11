import type { FC, PropsWithChildren, ReactNode } from "react";

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

export const Article: FC<
  {
    title?: string;
    subtitle?: ReactNode;
    skipTitleOffset?: boolean;
    fullWidth?: boolean;
  } & PropsWithChildren
> = ({
  children,
  title,
  subtitle,
  skipTitleOffset = false,
  fullWidth = false,
}) => {
  return (
    <article className="container mx-auto flex justify-between p-4">
      <div
        className={`mx-auto mb-16 w-full space-y-6 ${fullWidth ? "" : "lg:w-10/12"}`}
      >
        {title || subtitle ? (
          <div>
            {title ? (
              <h1
                className={"mb-6 text-3xl" + (skipTitleOffset ? "" : " mt-14")}
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

export const ArticleSectionWrapper: FC<
  PropsWithChildren & {
    id: string;
  }
> = ({ id, children }) => {
  return (
    <section className="space-y-4 lg:mt-4" aria-labelledby={id}>
      {children}
    </section>
  );
};

export const ArticleSectionOneColumns: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="relative mb-8 grid gap-8 lg:grid-cols-1 xl:gap-12">
      {children}
    </div>
  );
};
export const ArticleSectionTwoColumns: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="relative mb-8 grid gap-8 lg:grid-cols-2 xl:gap-12">
      {children}
    </div>
  );
};

export const ArticleSectionColumn: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mx-auto w-full space-y-2 lg:w-10/12 lg:w-full">
      {children}
    </div>
  );
};

export const ArticleSection: FC<
  PropsWithChildren & {
    title: string;
    id?: string;
  }
> = ({ children, title, id = `sec-${slugify(title)}` }) => {
  return (
    <ArticleSectionWrapper id={id}>
      <ArticleSectionTitle title={title} id={id} />
      {children}
    </ArticleSectionWrapper>
  );
};

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export const ArticleSectionTitle: FC<{
  title: string;
  id: string;
  as?: HeadingTag;
}> = ({ title, id, as = "h2" }) => {
  const Tag = as;
  return (
    <Tag id={id} className="mb-4 pt-6 text-2xl font-semibold">
      <a href={`#${id}`}>{title}</a>
    </Tag>
  );
};
