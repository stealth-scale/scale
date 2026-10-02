import { describe, expect, it } from "vitest";

import { stale, uncovered } from "@stealthscale/specimen";
import { axesOf, defaultsOf, recipeViolations, valuesOf } from "@stealthscale/testing-theme";

import page from "#composer/composer.specimen.tsx";
import { recipe, ROWS } from "#composer/recipe.ts";

describe("recipe", () => {
  it("covers every variant axis in the scenes of its specimen page", () => {
    expect(uncovered(recipe, page.scenes)).toStrictEqual([]);
  });

  it("leaves no scene referring to a variant value the recipe has dropped", () => {
    expect(stale(recipe, page.scenes)).toStrictEqual([]);
  });

  it("references a token on every value a theme has to be able to change", () => {
    expect(
      recipeViolations(recipe, { names: ["Composer.Root"], parts: [...recipe.slots] }),
    ).toStrictEqual([]);
  });

  it("sets className to composer", () => {
    expect(recipe.className).toBe("composer");
  });

  it("declares size and variant axes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size", "variant"]);
  });

  it("defaults to an outlined composer at the middle size", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md", variant: "outline" });
  });

  it("declares sm to lg on the size axis", () => {
    expect(valuesOf(recipe, "size")).toStrictEqual(["lg", "md", "sm"]);
  });

  it("grows the textarea with its content up to the rows the input writes", () => {
    expect(recipe.base?.["input"]).toMatchObject({
      fieldSizing: "content",
      maxBlockSize: `calc(var(${ROWS}) * 1lh + var(--composer-inset) * 2)`,
    });
  });

  it("renders a bare textarea without a field look of its own", () => {
    expect(recipe.base?.["input"]).toMatchObject({
      background: "transparent",
      borderStyle: "none",
      outline: "none",
      resize: "none",
    });
  });

  it("rings the box while the textarea has keyboard focus", () => {
    expect(recipe.base?.["root"]).toHaveProperty(
      "&:has(:is(input, select, textarea):is(:focus-visible, [data-focus-visible]))",
    );
  });

  it("gives the box the focus edge while files are dragged over it", () => {
    expect(recipe.base?.["root"]).toMatchObject({
      "&[data-dragging]": { "--field-edge": "{colors.border.focus}" },
    });
  });

  it("pushes the submit control to the end of its row", () => {
    expect(recipe.base?.["submit"]).toStrictEqual({ marginInlineStart: "auto" });
  });

  it("sizes the context strip's glyph to its text", () => {
    expect(recipe.base?.["context"]).toMatchObject({
      "& > svg": { blockSize: "1em", flexShrink: "0", inlineSize: "1em" },
    });
  });

  it("pushes the context strip's first control after its words to the end", () => {
    expect(recipe.base?.["context"]).toMatchObject({
      "& > :not(button) + button": { marginInlineStart: "auto" },
    });
  });

  it("matches the Composer parts", () => {
    expect(recipe.jsx).toStrictEqual([/^Composer\.\w+$/u]);
  });
});
