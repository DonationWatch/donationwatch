import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Translation } from "@/components/translation";

describe("Translation Component", () => {
  test("ICU translation using translator function and ReactNodes works correctly", () => {
    // Mock the translator function next-intl provides
    // oxlint-disable-next-line typescript/no-explicit-any
    const mockT = (key: string, variables: any) => {
      if (key === "test.key") {
        // Evaluate simple select/plural logic manually in our mock to simulate next-intl behavior
        const type = variables.type;
        const count = variables.count;
        const sum = variables.sum;
        return `Under ${type}: we found ${count} matching items totaling ${sum}.`;
      }
      return "";
    };

    const { container } = render(
      <Translation
        // oxlint-disable-next-line typescript/no-explicit-any
        t={mockT as any}
        translationId="test.key"
        variables={{
          type: "both",
          count: 5,
          sum: <em>$100</em>,
        }}
      />,
    );

    // It should successfully replace "__VAR__sum__" with the <em>$100</em> React node
    expect(container.innerHTML).toBe(
      "Under both: we found 5 matching items totaling <em>$100</em>.",
    );
  });
});
