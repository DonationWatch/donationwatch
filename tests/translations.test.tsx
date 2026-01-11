import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { splitTranslation, Translation } from "../src/components/translation";

describe("splitTranslation", () => {
  test("returns static translation string parts", () => {
    expect(splitTranslation("Hello world")).toEqual([
      { id: 0, type: "static", value: "Hello world" },
    ]);
  });

  test("supports dynamic parts at the beginning", () => {
    expect(splitTranslation("{user} what's up?")).toEqual([
      { id: 0, type: "variable", value: "user" },
      { id: 1, type: "static", value: " what's up?" },
    ]);
  });

  test("supports dynamic parts in the middle", () => {
    expect(splitTranslation("Hello {user} what's up?")).toEqual([
      { id: 0, type: "static", value: "Hello " },
      { id: 1, type: "variable", value: "user" },
      { id: 2, type: "static", value: " what's up?" },
    ]);
  });

  test("supports dynamic parts at the end", () => {
    expect(splitTranslation("Hello {user}")).toEqual([
      { id: 0, type: "static", value: "Hello " },
      { id: 1, type: "variable", value: "user" },
    ]);
  });

  test("supports multiple variable parts", () => {
    expect(
      splitTranslation("Hello {firstName} {lastName} how are you?"),
    ).toEqual([
      { id: 0, type: "static", value: "Hello " },
      { id: 1, type: "variable", value: "firstName" },
      { id: 2, type: "static", value: " " },
      { id: 3, type: "variable", value: "lastName" },
      { id: 4, type: "static", value: " how are you?" },
    ]);
  });
});

describe("Translation", () => {
  test("renders a translation without variables", () => {
    const { container } = render(<Translation text={"hello world"} />);
    expect(container.innerHTML).toBe("hello world");
  });

  test("renders a translation with simple variables", () => {
    const { container } = render(
      <Translation
        text={"hello {user}"}
        variables={{
          user: "MyUser",
        }}
      />,
    );
    expect(container.innerHTML).toBe("hello MyUser");
  });

  test("renders a translation with react node variables", () => {
    const { container } = render(
      <Translation
        text={"hello {user}"}
        variables={{
          user: <strong>MyUser</strong>,
        }}
      />,
    );
    expect(container.innerHTML).toBe("hello <strong>MyUser</strong>");
  });
});
