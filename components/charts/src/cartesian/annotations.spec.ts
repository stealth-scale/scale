import { describe, expect, it } from "vitest";

import { type Annotation, annotationNotesOf } from "#cartesian/annotations.ts";

/**
 * Lists a week of days, Monday first.
 */
const WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day, index) => ({
  day,
  visits: 100 + index,
}));

/**
 * Lists a deploy on Tuesday, a freeze from Thursday to Saturday and a flagged Friday.
 */
const NOTES: Annotation[] = [
  { at: "tue", key: "deploy", label: "Deploy 4.12" },
  { at: "thu", key: "freeze", label: "Freeze", until: "sat" },
  { at: "fri", color: "error", key: "spike", label: "Error spike", value: 105 },
];

/**
 * Returns the keys of the notes the tooltip writes at a day.
 */
function keysAt(annotations: readonly Annotation[], day: string): string[] {
  return (annotationNotesOf(annotations, WEEK, "day")?.(day) ?? []).map((note) => note.key);
}

describe("annotations", () => {
  it("writes no notes for a chart without annotations", () => {
    expect(annotationNotesOf([], WEEK, "day")).toBeUndefined();
  });

  it("notes a moment at its category", () => {
    expect(keysAt(NOTES, "tue")).toStrictEqual(["deploy"]);
  });

  it("notes a point at its category", () => {
    expect(keysAt(NOTES, "fri")).toStrictEqual(["freeze", "spike"]);
  });

  it.each(["thu", "fri", "sat"])("notes a period on %s between its ends", (day) => {
    expect(keysAt(NOTES, day)).toContain("freeze");
  });

  it.each(["wed", "sun"])("notes no period on %s outside its ends", (day) => {
    expect(keysAt(NOTES, day)).not.toContain("freeze");
  });

  it("notes a period whose ends are named last first", () => {
    expect(
      keysAt([{ at: "sat", key: "freeze", label: "Freeze", until: "thu" }], "fri"),
    ).toStrictEqual(["freeze"]);
  });

  it("notes no period with an end that is not a category", () => {
    expect(
      keysAt([{ at: "sat", key: "freeze", label: "Freeze", until: "next" }], "fri"),
    ).toStrictEqual([]);
  });

  it("writes a note with its words in the neutral palette's chart color unless stated", () => {
    expect(annotationNotesOf(NOTES, WEEK, "day")?.("tue")).toStrictEqual([
      { color: "var(--colors-neutral-chart)", key: "deploy", text: "Deploy 4.12" },
    ]);
  });

  it("writes a note in the chart color of its palette", () => {
    expect(annotationNotesOf(NOTES, WEEK, "day")?.("fri").at(-1)?.color).toBe(
      "var(--colors-error-chart)",
    );
  });
});
