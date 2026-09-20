import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import { recipe } from "#input-group/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["InputGroup.Root", "InputGroup.Field", "InputGroup.Start", "InputGroup.End"],
        parts: ["root", "field", "start", "end"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class input-group", () => {
    expect(recipe.className).toBe("input-group");
  });

  it("styles the four parts a group draws", () => {
    expect(recipe.slots).toStrictEqual(["root", "field", "start", "end"]);
  });

  it("offers an alignment axis and a marks axis and a size axis", () => {
    expect(axesOf(recipe)).toStrictEqual(["align", "marks", "size"]);
  });

  it("reserves both ends at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ align: "center", marks: "both", size: "md" });
  });

  it("offers a side for each mark and both together", () => {
    expect(valuesOf(recipe, "marks")).toStrictEqual(["both", "end", "start"]);
  });

  it("offers the eight control sizes", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual([
      "2xl",
      "3xl",
      "4xl",
      "lg",
      "md",
      "sm",
      "xl",
      "xs",
    ]);
  });

  it("states the room on the root as the control height of the step", () => {
    expect(recipe.variants?.["size"]?.["md"]?.["root"]).toStrictEqual({
      "--input-group-room": "{sizes.control.md}",
    });
  });

  it("sets each mark a control square wide in the label of its step", () => {
    const expected = {
      inlineSize: "calc({sizes.control.xs} * var(--density, 1))",
      textStyle: "label.xs",
    };

    expect(recipe.variants?.["size"]?.["xs"]?.["start"]).toStrictEqual(expected);
    expect(recipe.variants?.["size"]?.["xs"]?.["end"]).toStrictEqual(expected);
  });

  it("hands the room to the control's own inset property rather than writing padding", () => {
    expect(recipe.variants?.["marks"]?.["both"]?.["root"]).toStrictEqual({
      "--control-inset-end": "var(--input-group-room)",
      "--control-inset-start": "var(--input-group-room)",
    });
  });

  it("opens one side only where a mark sits at one end", () => {
    expect(recipe.variants?.["marks"]?.["start"]?.["root"]).toStrictEqual({
      "--control-inset-start": "var(--input-group-room)",
    });
  });

  it("writes nothing on the field slot", () => {
    expect.hasAssertions();

    for (const value of Object.values(recipe.variants?.["marks"] ?? {})) {
      expect(value).not.toHaveProperty("field");
    }
  });

  it("lets a press over a mark reach the field behind it", () => {
    expect(recipe.base?.["start"]).toMatchObject({
      "& > *": { pointerEvents: "auto" },
      pointerEvents: "none",
    });
  });

  it("tracks the group and every part under its namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^InputGroup(\.\w+)?$/u]);
  });
});
