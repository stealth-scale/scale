import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { type Audit, type Finding } from "#catalogue/audited.ts";
import { Findings } from "#catalogue/page-audit.tsx";

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

describe("Findings", () => {
  it("draws a block per rule broken", async () => {
    const two = [BROKEN, { ...BROKEN, rule: "label" }];
    const { getAllByRole } = await drawn(<Findings audit={audit(two)} />);

    expect(getAllByRole("link")).toHaveLength(2);
  });

  it("draws no block at all on a clean scene", async () => {
    const { queryAllByRole } = await drawn(<Findings audit={audit([])} />);

    expect(queryAllByRole("link")).toStrictEqual([]);
  });
});
