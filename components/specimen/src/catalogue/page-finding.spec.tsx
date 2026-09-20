import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type Finding } from "#catalogue/audited.ts";
import { Found } from "#catalogue/page-finding.tsx";

/**
 * Writes one finding, less whatever a case states itself.
 */
function finding(over: Partial<Finding> = {}): Finding {
  return {
    impact: "serious",
    on: [{ says: "Fix the contrast", selector: "#one" }],
    rule: "color-contrast",
    says: "Elements must meet minimum contrast",
    url: "https://example.test/color-contrast",
    ...over,
  };
}

describe("Found", () => {
  it("says how badly the rule was broken", async () => {
    const { getByText } = await drawn(<Found finding={finding()} />);

    expect(getByText("serious")).toBeDefined();
  });

  it("says so where axe rated the rule at all", async () => {
    const { getByText } = await drawn(<Found finding={finding({ impact: undefined })} />);

    expect(getByText("unrated")).toBeDefined();
  });

  it("names the rule by its own identifier", async () => {
    const { getByText } = await drawn(<Found finding={finding()} />);

    expect(getByText("color-contrast")).toBeDefined();
  });

  it("writes out what the rule asks for", async () => {
    const { getByText } = await drawn(<Found finding={finding()} />);

    expect(getByText("Elements must meet minimum contrast")).toBeDefined();
  });

  it("lists every element the rule was broken on", async () => {
    const held = finding({
      on: [
        { says: "one", selector: "#one" },
        { says: "two", selector: "#two" },
      ],
    });
    const { getAllByRole } = await drawn(<Found finding={held} />);

    expect(getAllByRole("listitem").map((one) => one.textContent)).toStrictEqual(["#one", "#two"]);
  });

  it("points at where the rule is written out in full", async () => {
    const { getByRole } = await drawn(<Found finding={finding()} />);

    expect(getByRole("link").getAttribute("href")).toBe("https://example.test/color-contrast");
  });

  it("opens the rule away from the audit that found it", async () => {
    const { getByRole } = await drawn(<Found finding={finding()} />);

    expect(getByRole("link").getAttribute("target")).toBe("_blank");
  });
});
