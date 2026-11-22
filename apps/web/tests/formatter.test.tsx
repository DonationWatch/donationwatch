import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import { FormatAnd } from "@/components/formatter";

describe("FormatAnd", () => {
  test("renders react nodes", () => {
    const html = renderToStaticMarkup(
      <FormatAnd
        locale={"de"}
        items={[
          <strong key={0}>hello</strong>,
          <span key={1}>MyUser</span>,
          <em key={2}>world</em>,
        ]}
      />,
    );

    expect(html).toBe(
      "<strong>hello</strong>, <span>MyUser</span> und <em>world</em>",
    );
  });
});
