import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type Audit, type Finding } from "#catalogue/audited.ts";
import { Rated } from "#catalogue/page-rated.tsx";

/**
 * One rule broken, for a case that needs the audit to have found something.
 */
const BROKEN: Finding = {
  impact: "serious",
  on: [{ says: "Fix it", selector: "#one" }],
  rule: "color-contrast",
  says: "Elements must meet minimum contrast",
  url: "https://example.test/color-contrast",
};

/**
 * Writes what an audit came to.
 */
function audit(findings: readonly Finding[], passed = 12): Audit {
  return { findings, passed };
}

describe("Rated", () => {
  it("reports nothing until an audit has run", async () => {
    const { container } = await drawn(<Rated audit={undefined} />);

    expect(container.textContent).toBe("");
  });

  it("says how many rules a clean scene was held to", async () => {
    const { getByText } = await drawn(<Rated audit={audit([])} />);

    expect(getByText("Nothing found, against 12 rules")).toBeDefined();
  });

  it("counts one rule as one rule", async () => {
    const { getByText } = await drawn(<Rated audit={audit([], 1)} />);

    expect(getByText("Nothing found, against 1 rule")).toBeDefined();
  });

  it("says how many rules a scene broke", async () => {
    const { getByText } = await drawn(<Rated audit={audit([BROKEN])} />);

    expect(getByText("Broken 1 rule")).toBeDefined();
  });

  it("counts several broken rules", async () => {
    const two = [BROKEN, { ...BROKEN, rule: "label" }];
    const { getByText } = await drawn(<Rated audit={audit(two)} />);

    expect(getByText("Broken 2 rules")).toBeDefined();
  });

  it("announces what it found as the run answers", async () => {
    const { container } = await drawn(<Rated audit={audit([])} />);

    expect(container.querySelector("[aria-live=polite]")).toBeDefined();
  });
});
