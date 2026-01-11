import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { FormatAnd } from "../src/components/formatter";

describe("FormatAnd", () => {
  test("renders react nodes", () => {
    const { container } = render(
      <FormatAnd
        locale={"de"}
        items={[
          <strong key={0}>hello</strong>,
          <span key={1}>MyUser</span>,
          <em key={2}>world</em>,
        ]}
      />,
    );

    expect(container.innerHTML).toBe(
      "<strong>hello</strong>, <span>MyUser</span> und <em>world</em>",
    );
  });
});
