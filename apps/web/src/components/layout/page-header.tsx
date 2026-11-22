import type { PropsWithChildren } from "react";

export const PageHeader = ({ children }: PropsWithChildren) => {
  return (
    <section data-page-header="" className="container mx-auto px-4">
      <div className="pt-14">{children}</div>
    </section>
  );
};
