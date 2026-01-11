/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/react-table";

import type { FunctionComponent, SVGAttributes } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    fill?: boolean;
  }
}

declare module "*.svg" {
  const content: FunctionComponent<SVGAttributes<SVGElement>>;
  export default content;
}
