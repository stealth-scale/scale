import { type AxeResults } from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { audited, type Engine, LANDMARK_RULES, RULES } from "#catalogue/audited.ts";

/**
 * Fragment that breaks three rules: two axe rates critical and one it rates serious.
 */
const BROKEN = '<img src="x"><ul><div>not a row</div></ul><input type="text">';

/**
 * Appends a fragment to the document for axe to read.
 */
function staged(html: string): Element {
  const held = document.createElement("div");

  held.innerHTML = html;
  document.body.append(held);

  return held;
}

/**
 * Returns one broken rule with the given impact and an optional failure summary.
 */
function broke(impact: null | string, summary?: string): unknown {
  return {
    help: "the rule's words",
    helpUrl: "https://example.test/one",
    id: impact ?? "unrated",
    impact,
    nodes: [{ target: ["#one"], ...(summary === undefined ? {} : { failureSummary: summary }) }],
  };
}

/**
 * Returns an engine that resolves to the given violations.
 */
function answering(...violations: readonly unknown[]): Engine {
  return () => Promise.resolve({ passes: [], violations } as unknown as AxeResults);
}

describe("audited", () => {
  it("returns no findings when the element breaks no rule", async () => {
    const { findings } = await audited(staged("<p>A line of words.</p>"));

    expect(findings).toStrictEqual([]);
  });

  it("counts the rules the element passes", async () => {
    const { passed } = await audited(staged(BROKEN));

    expect(passed).toBeGreaterThan(0);
  });

  it("returns a finding for every rule the element breaks", async () => {
    const { findings } = await audited(staged(BROKEN));

    expect(findings.map((finding) => finding.rule)).toStrictEqual(["image-alt", "label", "list"]);
  });

  it("sorts the findings worst impact first", async () => {
    const { findings } = await audited(staged(BROKEN));

    expect(findings.map((finding) => finding.impact)).toStrictEqual([
      "critical",
      "critical",
      "serious",
    ]);
  });

  it("returns the address of the rule's documentation", async () => {
    const { findings } = await audited(staged('<img src="x">'));

    expect(findings[0]?.url).toContain("image-alt");
  });

  it("returns the selector of the element a rule fails on", async () => {
    const { findings } = await audited(staged('<img id="lone" src="x">'));

    expect(findings[0]?.on[0]?.selector).toBe("#lone");
  });

  it("returns a summary that names the missing alt attribute", async () => {
    const { findings } = await audited(staged('<img src="x">'));

    expect(findings[0]?.on[0]?.says).toContain("alt");
  });

  it("leaves impact undefined when axe rates the rule null", async () => {
    const { findings } = await audited(document.body, { engine: answering(broke(null)) });

    expect(findings[0]?.impact).toBeUndefined();
  });

  it("sorts an unrated finding after every rated finding", async () => {
    const { findings } = await audited(document.body, {
      engine: answering(broke(null), broke("minor")),
    });

    expect(findings.map((finding) => finding.rule)).toStrictEqual(["minor", "unrated"]);
  });

  it("returns the rule's help when an element has no failure summary", async () => {
    const { findings } = await audited(document.body, { engine: answering(broke("minor")) });

    expect(findings[0]?.on[0]?.says).toBe("the rule's words");
  });

  it("returns the failure summary when the engine reports one", async () => {
    const { findings } = await audited(document.body, {
      engine: answering(broke("minor", "name it")),
    });

    expect(findings[0]?.on[0]?.says).toBe("name it");
  });

  it("audits an iframe without entering its document", async () => {
    const { findings } = await audited(
      staged('<iframe sandbox="" srcdoc="<p>Paid</p>" title="Receipt"></iframe>'),
    );

    expect(findings).toStrictEqual([]);
  });

  it("returns no findings when a scene repeats a named main region", async () => {
    const { findings } = await audited(
      staged('<main aria-label="Runs">Runs</main><main aria-label="Runs">Runs</main>'),
    );

    expect(findings).toStrictEqual([]);
  });

  it("disables every rule in LANDMARK_RULES", () => {
    expect(LANDMARK_RULES.map((rule) => RULES.rules?.[rule]?.enabled)).toStrictEqual(
      LANDMARK_RULES.map(() => false),
    );
  });

  it("passes RULES to the engine when rules is absent", async () => {
    const engine = vi.fn<Engine>(answering());

    await audited(document.body, { engine });

    expect(engine).toHaveBeenCalledWith(document.body, RULES);
  });

  it("passes the given rules to the engine", async () => {
    const engine = vi.fn<Engine>(answering());
    const rules = { rules: { region: { enabled: true } } };

    await audited(document.body, { engine, rules });

    expect(engine).toHaveBeenCalledWith(document.body, rules);
  });
});
