import type { FC, PropsWithChildren } from "react";

export const PageHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className="container mx-auto px-4">
      <div className="pt-14">{children}</div>
    </section>
  );
};
