import { type AxeResults } from "axe-core";
import { describe, expect, it } from "vitest";

import { audited, type Engine } from "#catalogue/audited.ts";

/**
 * A fragment that breaks three rules: two axe rates critical and one it rates serious.
 */
const BROKEN = '<img src="x"><ul><div>not a row</div></ul><input type="text">';

/**
 * Draws a fragment in the document, for axe to read the way it reads a scene.
 */
function staged(html: string): Element {
  const held = document.createElement("div");

  held.innerHTML = html;
  document.body.append(held);

  return held;
}

/**
 * Writes one broken rule, named by its rating and said however a case asks.
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
 * Answers with the rules a case asks for, each rated however the case asks.
 */
function answering(...violations: readonly unknown[]): Engine {
  return () => Promise.resolve({ passes: [], violations } as unknown as AxeResults);
}

describe("audited", () => {
  it("finds nothing on a fragment that breaks no rule", async () => {
    const { findings } = await audited(staged("<p>A line of words.</p>"));

    expect(findings).toStrictEqual([]);
  });

  it("counts the rules the fragment was held to and passed", async () => {
    const { passed } = await audited(staged(BROKEN));

    expect(passed).toBeGreaterThan(0);
  });

  it("names every rule the fragment broke", async () => {
    const { findings } = await audited(staged(BROKEN));

    expect(findings.map((finding) => finding.rule)).toStrictEqual(["image-alt", "label", "list"]);
  });

  it("puts the rules axe rated worst first", async () => {
    const { findings } = await audited(staged(BROKEN));

    expect(findings.map((finding) => finding.impact)).toStrictEqual([
      "critical",
      "critical",
      "serious",
    ]);
  });

  it("reads where a rule is written out in full", async () => {
    const { findings } = await audited(staged('<img src="x">'));

    expect(findings[0]?.url).toContain("image-alt");
  });

  it("names the element a rule was broken on by the selector that finds it", async () => {
    const { findings } = await audited(staged('<img id="lone" src="x">'));

    expect(findings[0]?.on[0]?.selector).toBe("#lone");
  });

  it("reads the line axe writes about the element", async () => {
    const { findings } = await audited(staged('<img src="x">'));

    expect(findings[0]?.on[0]?.says).toContain("alt");
  });

  it("leaves a rule axe rated at nothing unrated", async () => {
    const { findings } = await audited(document.body, answering(broke(null)));

    expect(findings[0]?.impact).toBeUndefined();
  });

  it("sorts a rule axe left unrated under every rule it rated", async () => {
    const { findings } = await audited(document.body, answering(broke(null), broke("minor")));

    expect(findings.map((finding) => finding.rule)).toStrictEqual(["minor", "unrated"]);
  });

  it("falls back to the rule's own words where axe writes none about an element", async () => {
    const { findings } = await audited(document.body, answering(broke("minor")));

    expect(findings[0]?.on[0]?.says).toBe("the rule's words");
  });

  it("reads the line axe writes about an element where it writes one", async () => {
    const { findings } = await audited(document.body, answering(broke("minor", "name it")));

    expect(findings[0]?.on[0]?.says).toBe("name it");
  });
});
